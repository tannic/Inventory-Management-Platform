from django.contrib import admin
from db_tables.models import *
from guardian.admin import GuardedModelAdmin

class CompanyAdmin(GuardedModelAdmin):
	pass

admin.site.register(Company, CompanyAdmin)

class AddressAdmin(GuardedModelAdmin):
	pass

admin.site.register(Address, AddressAdmin)
admin.site.register(Employee)
admin.site.register(ProductTags)
admin.site.register(Product)
admin.site.register(ProductPurchaseRecord)
admin.site.register(InstockRecord)
admin.site.register(Order)
admin.site.register(RecordOrder)
admin.site.register(Invoice)
admin.site.register(ProductImage)
