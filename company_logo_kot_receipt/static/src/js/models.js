odoo.define('pos_logo_product.models', function (require) {
    "use strict";

    const { Order } = require('point_of_sale.models');
    const Registries = require('point_of_sale.Registries');
    const core = require('web.core');
    const QWeb = core.qweb;


    const PosRestaurantLogoOrder = (Order) => class PosRestaurantlogoOrder extends Order {


        getNoteForProduct(productId) {
            const order = this.pos.get_order();
            const orderLine = order.get_orderlines().find(line => line.product.id === productId);
            return orderLine ? orderLine.get_customer_note() : '';
        }

        async printChanges() {
            let isPrintSuccessful = true;
            const d = new Date();
            let date = d.toLocaleDateString();
            let hours = '' + d.getHours();
            hours = hours.length < 2 ? ('0' + hours) : hours;
            let minutes = '' + d.getMinutes();
            minutes = minutes.length < 2 ? ('0' + minutes) : minutes;

            let pc = false;

            for (const printer of this.pos.unwatched.printers) {
                const changes = this._getPrintingCategoriesChanges(printer.config.product_categories_ids);
                if (changes['new'].length > 0 || changes['cancelled'].length > 0) {
                    const waiter = this.pos.get_cashier(); // Replace with the actual source of waiter information
                    const numberOfGuests = this.getCustomerCount(); // Replace with the actual source of the number of guests information

                    // Include notes from POS changes
                    const ChangesWithNotes = {
                        new: changes.new.map(change => ({ ...change, note: this.getNoteForProduct(change.product_id) })),
                        cancelled: changes.cancelled.map(change => ({ ...change, note: this.getNoteForProduct(change.product_id) })),
                    };

                    console.log("POS Changes")
                    console.log(ChangesWithNotes)

                    const printingChanges = {
                        company: this.pos.company,
                        company_logo: this.pos.company_logo_base64,
                        new: ChangesWithNotes['new'],
                        cancelled: ChangesWithNotes['cancelled'],
                        table_name: this.pos.config.iface_floorplan ? this.getTable().name : false,
                        floor_name: this.pos.config.iface_floorplan ? this.getTable().floor.name : false,
                        name: this.name || 'unknown order',
                        time: {
                            date,
                            hours,
                            minutes,
                        },
                        waiter: waiter.name || 'unknown waiter', // Provide a default if the waiter information is not available
                        numberOfGuests: numberOfGuests + " guests" || 0 + " guests", // Provide a default if the number of guests information is not available
                    };
                    pc = printingChanges
                    
                    const receipt = QWeb.render('OrderChangeReceipt', { changes: printingChanges });
                    const result = await printer.print_receipt(receipt);
                    if (!result.successful) {
                        isPrintSuccessful = false;
                    }
                }
            }

            console.log("Printing Changes")
            console.log(pc)

            return isPrintSuccessful;
        }


    }
    Registries.Model.extend(Order,PosRestaurantLogoOrder);

});
