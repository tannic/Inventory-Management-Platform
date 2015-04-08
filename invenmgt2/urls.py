from django.conf.urls import patterns, include, url

from django.contrib import admin

from api.resources import *
from tastypie.api import Api
from db_tables.views import *
from django.views.generic import RedirectView


admin.autodiscover()

v1_api = Api(api_name='v1')

v1_api.register(CountryResource())
v1_api.register(CurrencyResource())
v1_api.register(SalesChannelResource())
v1_api.register(AddressResource())
v1_api.register(CompanyResource())
v1_api.register(EmployeeRoleResource())
v1_api.register(ProductStatusResource())
v1_api.register(EmployeeResource())
v1_api.register(ProductTagsResource())
v1_api.register(ProductPurchaseRecordResource())
v1_api.register(OrderStatusResource())
v1_api.register(OrderRecordResource())
v1_api.register(OrderResource())
v1_api.register(ProductResource())
v1_api.register(RecordStatusResource())
v1_api.register(RecordOrderActionsResource())
v1_api.register(PaymentMethodResource())
v1_api.register(InvoiceResource())
v1_api.register(InstockRecordResource())
v1_api.register(ProductImageResource())
v1_api.register(SignupResource())
v1_api.register(NewCompanyResource())

urlpatterns = patterns('',
	(r'^favicon\.ico$', RedirectView.as_view(url='/site_media/assets/images/favicon.ico')),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^api/', include(v1_api.urls)),
    url(r'^login/', login),
    url(r'^logout/', logout),
    url(r'^accounts/login/', login),
    url(r'^signup/', signup),
    url(r'^dashboard/', index),
    url(r'^$', home),
    (r'^site_media/(?P<path>.*)$','django.views.static.serve',{'document_root':settings.STATIC_PATH,}),
) 