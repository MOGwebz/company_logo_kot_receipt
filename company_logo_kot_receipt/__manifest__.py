# -*- coding: utf-8 -*-
{
    'name': "Company, Waiter and Date-time KOT Receipt",

    'summary': """
        Company Logo, Waiter and Date-time on KOT Receipt""",

    'description': """
        Revolutionize your restaurant's KOT system with TechThings Ltd.'s innovative Odoo POS module. 
        This dynamic addition prominently displays your company's logo and the waiter's name on each KOT, adding a personalized and professional touch to your kitchen's order processing. 
        Elevate your restaurant's efficiency and branding with this simple yet impactful upgrade.
    """,

    'author': "TechThings",
    'website': "https://techthings.it",

    'version': '1.0.0',
    'category': 'Point of Sale',
    'images': ['static/description/banner.gif'],

    # any module necessary for this one to work correctly
    'depends': ['pos_restaurant'],

    # always loaded
    'data': [],
    'assets' : {
        'point_of_sale.assets' : [
            'company_logo_kot_receipt/static/src/js/models.js',
            'company_logo_kot_receipt/static/src/xml/Screens/ReceiptScreen/OrderReceipt.xml',
        ],
    },
    'license': 'AGPL-3',
    'installable': True,
}
