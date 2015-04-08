from tastypie.resources import ModelResource, ALL, ALL_WITH_RELATIONS, Resource
from tastypie import fields
from tastypie.authentication import *
from tastypie.authorization import *
from guardian_authorization import *
from db_tables.models import *
from django.conf.urls import url
from django.contrib.auth.models import User
from error import *
from django.db import IntegrityError
from tastypie.exceptions import NotFound, BadRequest
from datetime import *
from django.utils.timezone import utc
from tastypie.utils import trailing_slash
from django.contrib import auth  


class MultipartResource(object):
    def deserialize(self, request, data, format=None):
        if not format:
            format = request.META.get('CONTENT_TYPE', 'application/json')
        if format == 'application/x-www-form-urlencoded':
            return request.POST
        if format.startswith('multipart'):
            data = request.POST.copy()
            data.update(request.FILES)
            return data
        return super(MultipartResource, self).deserialize(request, data, format)

class CountryResource(ModelResource):
	class Meta:
		queryset = Country.objects.all()
		resources_name = 'country'
		list_allowed_methods = ['get',]
		detail_allowed_methods = ['get',]
		
		authentication = Authentication()
		authorization = Authorization()

		filtering = {
			'name' : ALL_WITH_RELATIONS,
		}

		excludes = [
		'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class CurrencyResource(ModelResource):
	class Meta:
		queryset = Currency.objects.all()
		resources_name = 'currency'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = Authorization()

		filtering = {
			'name' : ALL_WITH_RELATIONS,
		}

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class SalesChannelResource(ModelResource):
	class Meta:
		queryset = SalesChannel.objects.all()
		resources_name = 'channel'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = Authorization()

		filtering = {
			'channel_name' : ALL_WITH_RELATIONS, 
		}

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class CompanyResource(ModelResource):
	belong_to = fields.ForeignKey('self','belong_to')
	sales_channel = fields.ForeignKey(SalesChannelResource, 'sales_channel', full = True)
	default_currency = fields.ForeignKey(CurrencyResource, 'default_currency', full = True)
	credit_currency = fields.ForeignKey(CurrencyResource, 'credit_currency', full = True)

	class Meta:
		queryset = Company.objects.all()
		resources_name = 'company'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]

		always_return_data = True

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'id': ALL_WITH_RELATIONS,
			'name' : ALL_WITH_RELATIONS,
			'registration_no' : ('exact',),
			'belong_to' : ALL_WITH_RELATIONS
		}

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]


	def obj_create(self, bundle, request = None, **kwarg):

		bundle.data['is_paid_client'] = u'False'
		bundle.data['credit_amount'] = bundle.data['initial_creditAmount']
		bundle = super(CompanyResource, self).obj_create(bundle, **kwarg)
		employee = Employee.objects.get(pk = bundle.request.user.pk)
		company = employee.belong_to
		bundle.obj.belong_to = company
		bundle.obj.is_paid_client=False
		bundle.obj.save()

		return bundle

class AddressResource(ModelResource):
	company = fields.ForeignKey(CompanyResource, 'company')
	country = fields.ForeignKey(CountryResource, 'country', full=True)

	class Meta:
		queryset = Address.objects.all()
		resources_name = 'address'
		always_return_data = True

		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]

		authentication = MultiAuthentication(
			SessionAuthentication(),
			BasicAuthentication(),
			)
		authorization = GuardianAuthorization()

		filtering = {
			'company' : ALL_WITH_RELATIONS,
		}

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class EmployeeRoleResource(ModelResource):
	class Meta:
		queryset = EmployeeRole.objects.all()
		resources_name = 'role'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = MultiAuthentication(
			SessionAuthentication(),
			BasicAuthentication(),
			)
		authorization = GuardianAuthorization()

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]	

class ProductStatusResource(ModelResource):
	class Meta:
		queryset = ProductStatus.objects.all()
		resources_name = 'productstatus'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class EmployeeResource(ModelResource):
	belong_to = fields.ForeignKey(CompanyResource,'belong_to', full=True, null=True)
	employee_role = fields.ForeignKey(EmployeeRoleResource, 'employee_role', full=True)

	class Meta:
		always_return_data = True
		queryset = Employee.objects.all()
		resources_name = 'employee'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]
		
		authentication = MultiAuthentication(
			SessionAuthentication(),
			BasicAuthentication(),
			)
		authorization = GuardianAuthorization()

		filtering = {
			'id' : ALL_WITH_RELATIONS,
			'username' : ALL_WITH_RELATIONS,
			'first_name' : ALL_WITH_RELATIONS,
			'last_name' : ALL_WITH_RELATIONS,
		}		

		excludes = [
		'password',
        'is_staff', 
        'is_superuser', 
        'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

	def obj_create(self, bundle, request = None, **kwarg):
		try:
			bundle = super(EmployeeResource, self).obj_create(bundle, **kwarg)
			print bundle.request.user.username
			employee = Employee.objects.get(pk = bundle.request.user.id)
			company = employee.belong_to
			bundle.obj.belong_to = company
			bundle.obj.set_password(bundle.data.get('password'))
			bundle.obj.save()
		except IntegrityError:
			raise BadRequest('That username already exists')
		return bundle

	def obj_update(self, bundle, request = None, **kwarg):
		user = Employee.objects.get(pk = bundle.request.user.pk)
		if user.employee_role.role == 'admin' or user.employee_role.role == 'mgr':
			return super(EmployeeResource, self).obj_update(bundle, request, **kwarg)
		else:
			auser = Employee.objects.get(id = bundle.data['id'])
			role = EmployeeRole.objects.get(pk = auser.employee_role.pk)
			bundle = super(EmployeeResource, self).obj_update(bundle, request, **kwarg)
			auser = Employee.objects.get(id = bundle.data['id'])
			auser.role = role
			auser.save()
			return bundle
	
	def obj_delete(self, bundle, request=None, **kwarg):
		e = Employee.objects.get(pk=kwarg['pk'])
		e.is_active = False
		e.save()
		return bundle

class ProductTagsResource(ModelResource):
	belong_to = fields.ForeignKey(CompanyResource, 'belong_to')

	class Meta:
		queryset = ProductTags.objects.all()
		resources_name = 'producttags'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'name' : ALL_WITH_RELATIONS,
		}

		excludes = ['belong_to',
		'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

	def obj_create(self, bundle, request = None, **kwarg):
		employee = Employee.objects.get(pk = bundle.request.user.pk)
		company = employee.belong_to		
		bundle.data['belong_to'] = u'/api/v1/company/{0}/'.format(company.pk)
		bundle = super(ProductTagsResource, self).obj_create(bundle, **kwarg)
		return bundle

class ProductImageResource(MultipartResource, ModelResource):
	owner = fields.ToOneField("api.resources.ProductResource", 'owner')
	image = fields.FileField(attribute="image")
	class Meta:
		queryset = ProductImage.objects.all()
		resources_name = 'productimage'
		list_allowed_methods = ['get', 'post','delete',]
		detail_allowed_methods = ['get', 'post','delete',]
		#authorization = Authorization()
		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()
		always_return_data = True

class ProductResource(ModelResource):
	tag = fields.ToManyField(ProductTagsResource, 'tag', null = True, full=True)
	inventory_status = fields.ForeignKey(ProductStatusResource, 'inventory_status', full=True)
	belong_to = fields.ForeignKey(CompanyResource, 'belong_to', full=True, null=True)
	image = fields.ToManyField(ProductImageResource, 'productimage_set', null = True, full=True)

	class Meta:
		queryset = Product.objects.all()
		resources_name = 'product'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]
		ordering = ['id',]
		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()
		always_return_data = True

		filtering = {
			'id' : ALL_WITH_RELATIONS,
			'name' : ALL_WITH_RELATIONS,
			'inventory_free' : ALL_WITH_RELATIONS,
			'is_fifo': ALL_WITH_RELATIONS,
			'leadtime': ALL_WITH_RELATIONS,
			'tag': ALL_WITH_RELATIONS,
			'rrp': ALL_WITH_RELATIONS,
			'inventory_status': ALL_WITH_RELATIONS,
		}

		excludes = [
		'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

	def obj_create(self, bundle, request = None, **kwarg):
		bundle.data['inventory_lock'] = 0
		employee = Employee.objects.get(pk = bundle.request.user.pk)
		bundle.data['belong_to'] = '/api/v1/company/{0}/'.format(employee.belong_to.pk)
		bundle = super(ProductResource, self).obj_create(bundle, **kwarg)
		return bundle

class ProductPurchaseRecordResource(ModelResource):
	product = fields.ForeignKey(ProductResource, 'product', )
	supplier = fields.ForeignKey(CompanyResource, 'supplier', full=True)
	purchase_currency = fields.ForeignKey(CurrencyResource, 'purchase_currency', full=True)

	class Meta:
		queryset = ProductPurchaseRecord.objects.all()
		resources_name = 'productpurchaserecord'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]
		ordering = ['id','purchase_date']
		always_return_data = True
		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'id': ALL_WITH_RELATIONS,
			'product' : ALL_WITH_RELATIONS,
			'purchase_date' : ALL_WITH_RELATIONS,
			'anticipate_arrival_date' : ALL_WITH_RELATIONS,
		}

		excludes = [
		'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

	def obj_create(self, bundle, request = None, **kwarg):

		try:
			pd = datetime.strptime(bundle.data['purchase_date'], '%Y-%m-%d')
			ad = datetime.strptime(bundle.data['anticipate_arrival_date'], '%Y-%m-%d')
			if pd.date() > ad.date():
				raise BadRequest('Anticipate arrival date cannot be before purchase date!')
		except:
			pass

		bundle = super(ProductPurchaseRecordResource, self).obj_create(bundle, **kwarg)

		return bundle

	def obj_update(self, bundle, request = None, **kwarg):
		try:
			pd = datetime.strptime(bundle.data['purchase_date'], '%Y-%m-%d')
			ad = datetime.strptime(bundle.data['anticipate_arrival_date'], '%Y-%m-%d')
			if pd.date() > ad.date():
				raise BadRequest('Anticipate arrival date cannot be before purchase date!')
		except:
			pass

		bundle = super(ProductPurchaseRecordResource, self).obj_update(bundle, request, **kwarg)

		return bundle

class InstockRecordResource(ModelResource):
	product = fields.ForeignKey(ProductResource, 'product')
	purchase_record = fields.ForeignKey(ProductPurchaseRecordResource, 'purchase_record', full=True, null=True)
	available_qty = fields.IntegerField('available_qty', readonly = True)

	class Meta:
		queryset = InstockRecord.objects.all()
		resources_name = 'instockrecord'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]
		ordering = ['id','instock_date']

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'id': ALL_WITH_RELATIONS,
			'instock_date' : ALL_WITH_RELATIONS,
			'product' : ALL_WITH_RELATIONS,
			'purchase_record' : ALL_WITH_RELATIONS,
		}

		excludes = [
		'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

	def obj_create(self, bundle, request = None, **kwarg):

		#check record consistancy
		id_regex = re.compile("/(\d+)/$")
		record = False
		product = False
		try:
			record_id = int(id_regex.findall(bundle.data['purchase_record'])[0])
			record = ProductPurchaseRecord.objects.get(pk = record_id)
		except:
			pass

		try:
			product_id = int(id_regex.findall(bundle.data['product'])[0])
			product = Product.objects.get(pk = product_id)
		except:
			pass

		if record and product:
			if record.product.pk != product.pk:
				raise BadRequest('Product in purchase record mismatch!')

		elif record:
			bundle.data['product'] = '/api/v1/product/{0}/'.format(record.product.pk)


		#check date
		try:
			in_date = datetime.strptime(bundle.data['instock_date'], '%Y-%m-%d')
			buy_date = record.purchase_date
			if in_date.date() < buy_date:
				raise BadRequest('Instock date cannot be before purchase date')
		except:
			pass

		#set availibility
		bundle = super(InstockRecordResource, self).obj_create(bundle, **kwarg)
		bundle.obj.available_qty = bundle.obj.initial_instock_qty
		bundle.obj.save()
		bundle.obj.product.inventory_free = bundle.obj.product.inventory_free + int(bundle.obj.initial_instock_qty)
		bundle.obj.product.save()

		return bundle

	def obj_update(self, bundle, request = None, **kwarg):
		record_id = kwarg['pk']
		record = InstockRecord.objects.get(pk = record_id)

		super(InstockRecordResource, self).obj_update(bundle, **kwarg)

		initial_instock_qty_change_ = bundle.obj.initial_instock_qty - record.initial_instock_qty
		available_qty_change_ = bundle.obj.available_qty - record.available_qty

		if initial_instock_qty_change_!=0 or available_qty_change_!=0:
			log = InstockRecordLog(
				record = bundle.obj,
				initial_instock_qty_change = initial_instock_qty_change_,
				available_qty_change = available_qty_change_,
				date = datetime.utcnow().replace(tzinfo=utc),
				person = Employee.objects.get(pk = bundle.request.user.pk)
				)
			log.save()

class OrderStatusResource(ModelResource):
	class Meta:
		queryset = OrderStatus.objects.all()
		resources_name = 'orderstatus'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'id': ALL_WITH_RELATIONS,
			'name' : ALL_WITH_RELATIONS,
		}

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class RecordStatusResource(ModelResource):
	class Meta:
		queryset = RecordStatus.objects.all()
		resources_name = 'recordstatus'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'id': ALL_WITH_RELATIONS,
			'name' : ALL_WITH_RELATIONS,
		}


		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]	

class OrderRecordResource(ModelResource):
	product = fields.ForeignKey(ProductResource, 'product', full = True)
	status = fields.ForeignKey(RecordStatusResource, 'status', full = True)

	class Meta:
		queryset = RecordOrder.objects.all()
		resources_name = 'orderrecord'
		list_allowed_methods = ['get', 'post', 'put', ]
		detail_allowed_methods = ['get', 'post', 'put', ]		
		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		always_return_data = True

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]


	def obj_create(self, bundle, request = None, **kwarg):
		id_regex = re.compile("/(\d+)/$")

		print id_regex.findall(bundle.data['product'])

		print bundle.data['product']

		product_id = int(id_regex.findall(bundle.data['product'])[0])
		product = Product.objects.get(pk = product_id)
		inventory_free = product.inventory_free
		inventory_lock = int(bundle.data['quantity'])

		if inventory_free < inventory_lock:
			raise BadRequest("No enough inventory left!")
			return bundle

		bundle = super(OrderRecordResource, self).obj_create(bundle, **kwarg)
		order_id = int(id_regex.findall(bundle.data['owner'])[0])
		order = Order.objects.get(pk = order_id)
		bundle.obj.owner = order
		bundle.obj.save()
		bundle.obj.product.inventory_free = bundle.obj.product.inventory_free - int(bundle.obj.quantity)
		bundle.obj.product.inventory_lock = bundle.obj.product.inventory_lock + int(bundle.obj.quantity)
		bundle.obj.product.save()

		records = RecordOrder.objects.filter(owner = bundle.obj.owner).exclude(status = RecordStatus.objects.get(name = 'cancel'))
		
		confirmed = 1
		ready_to_ship =1

		for r in records:
			confirmed = confirmed * (r.status.name == 'confirmed' or r.status.name == 'picked up')
			ready_to_ship = ready_to_ship * (r.status.name == 'picked up')

		if confirmed and not ready_to_ship:
			bundle.obj.owner.status = OrderStatus.objects.get(name = 'picking up')
		elif ready_to_ship and confirmed:
			bundle.obj.owner.status = OrderStatus.objects.get(name = 'ready to ship')
		else:
			bundle.obj.owner.status = OrderStatus.objects.get(name = 'pending')

		bundle.obj.owner.save()

		log = RecordOrderActions(
			request_record = bundle.obj,
			qty_change = 0,
			discount_change = 0,
			new_status = RecordStatus.objects.get(name = bundle.obj.status),
			action_person = Employee.objects.get(pk = bundle.request.user.pk),
			action_date = datetime.utcnow().replace(tzinfo=utc),
			comment = 'create'
			)
		log.save()

		return bundle

	def obj_update(self, bundle, request = None, **kwarg):
		record_pk = kwarg['pk']
		record = RecordOrder.objects.get(pk = record_pk)
		quantity = record.quantity
		discount = record.discount_percentage
		status = record.status.name

		print bundle.data

		bundle = super(OrderRecordResource, self).obj_update(bundle, **kwarg)


		if bundle.obj.status.name == 'cancel':
			bundle.obj.quantity = 0
			bundle.obj.save()
		
		log = RecordOrderActions(
			request_record = bundle.obj,
			qty_change = bundle.obj.quantity - quantity,
			discount_change = bundle.obj.discount_percentage -discount,
			new_status = RecordStatus.objects.get(name = status),
			action_person = Employee.objects.get(pk = bundle.request.user.pk),
			action_date = datetime.utcnow().replace(tzinfo=utc),
			comment = ''
			)
		log.save()

		if log.qty_change!=0 or log.discount_change!=0:
			if bundle.obj.status.name != 'cancel':
				bundle.obj.status=RecordStatus.objects.get(name = 'pending');
				bundle.obj.save();

		product = bundle.obj.product
		product.inventory_free = product.inventory_free - log.qty_change
		product.inventory_lock = product.inventory_lock + log.qty_change
		product.save()

		records = RecordOrder.objects.filter(owner = bundle.obj.owner).exclude(status = RecordStatus.objects.get(name = 'cancel'))
		
		confirmed = 1
		ready_to_ship =1

		for r in records:
			confirmed = confirmed * (r.status.name == 'confirmed'  or r.status.name == 'picked up')
			ready_to_ship = ready_to_ship * (r.status.name == 'picked up')

		if confirmed and not ready_to_ship:
			bundle.obj.owner.status = OrderStatus.objects.get(name = 'picking up')
		elif ready_to_ship and confirmed:
			bundle.obj.owner.status = OrderStatus.objects.get(name = 'ready to ship')
		else:
			bundle.obj.owner.status = OrderStatus.objects.get(name = 'pending')

		bundle.obj.owner.save()

		return bundle

class OrderResource(ModelResource):
	records = fields.ToManyField(OrderRecordResource, 
		'recordorder_set', 
		null = True, full = True)
	customer = fields.ForeignKey(CompanyResource, 'customer', full = True)
	sales = fields.ForeignKey(EmployeeResource, 'sales', full = True)
	delivery_address = fields.ForeignKey(AddressResource, 'delivery_address', full = True)
	status = fields.ForeignKey(OrderStatusResource, 'status', full = True)

	class Meta:
		queryset = Order.objects.all()
		resources_name = 'order'
		list_allowed_methods = ['get', 'post', 'put', ]
		detail_allowed_methods = ['get', 'post', 'put', ]
		always_return_data = True
		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()
		ordering = ['id',]
		always_return_data = True

		filtering = {
			'id': ALL_WITH_RELATIONS,
			'uuid' : ALL_WITH_RELATIONS,
			'customer' : ALL_WITH_RELATIONS,
			'sales' : ALL_WITH_RELATIONS,
			'delivery_address' : ALL_WITH_RELATIONS,
			'status' : ALL_WITH_RELATIONS,
			'date' : ALL_WITH_RELATIONS,
			'completedate' : ALL_WITH_RELATIONS,
		}

		excludes = [
		'belong_to',
		'reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]
	

	def dehydrate(self, bundle):

		total_price = 0
		for r in RecordOrder.objects.filter(owner = bundle.obj):
			if r.status.name != 'cancel':
				total_price = total_price + r.quantity * r.discount_percentage * r.product.rrp / 100
		bundle.data['total_price'] = total_price

		return bundle

	def obj_create(self, bundle, request = None, **kwarg):
		bundle = super(OrderResource, self).obj_create(bundle, **kwarg)
		bundle.obj.createdate = datetime.utcnow().replace(tzinfo=utc)
		employee = Employee.objects.get(pk = bundle.request.user.pk)
		bundle.obj.belong_to = employee.belong_to
		# universal unique order id = clientID + CustomerID + OrderID + Purchse_Date
		dt = date.today()
		uuid = u'O%5.5d%5.5d%5.5d%s' % (bundle.obj.customer.pk, bundle.obj.belong_to.pk, bundle.obj.pk, dt.strftime('%d%m%Y'))
		bundle.obj.uuid = uuid
		bundle.obj.save()
		return bundle

	def obj_update(self, bundle, request = None, **kwarg):
		order_id = kwarg['pk']
		old_order = Order.objects.get(pk = order_id)

		bundle = super(OrderResource, self).obj_update(bundle, **kwarg)

		if bundle.obj.status.name == 'completed':
			bundle.obj.completedate = datetime.utcnow().replace(tzinfo=utc)
			bundle.obj.save()

		records = RecordOrder.objects.filter(owner = bundle.obj).exclude(status = RecordStatus.objects.get(name = 'cancel'))

		if bundle.obj.status.name == 'shipped':
			for r in records:
				if r.status.name != 'picked up':
					bundle.obj = old_order
					bundle.obj.save()
					raise BadRequest('Products are not ready to ship yet!')
					return bundle
				else:
					p = r.product
					p.inventory_lock = p.inventory_lock - r.quantity
					p.save()
					if p.is_fifo:
						instockrecords = InstockRecord.objects.filter(product = p).order_by('-instock_date')
					else:
						instockrecords = InstockRecord.objects.filter(product = p).order_by('instock_date')
					left = r.quantity
					for i in instockrecords:
						if left > i.available_qty:
							left = left - i.available_qty
							i.available_qty = 0
							i.save()
						elif left < i.available_qty and left > 0:
							i.available_qty = i.available_qty - left
							left = 0
							i.save()

		elif bundle.obj.status.name == 'cancel':
			for r in records:
				r.status = RecordStatus.objects.get(name = 'cancel')
				log = RecordOrderActions(
					request_record = r,
					qty_change = -r.quantity,
					discount_change = r.discount_percentage,
					new_status = r.status,
					action_person = Employee.objects.get(pk = bundle.request.user.pk),
					action_date = datetime.utcnow().replace(tzinfo=utc),
					comment = ''
					)
				log.save()
				r.quantity = 0
				r.save()
				product = r.product
				product.inventory_free = product.inventory_free - log.qty_change
				product.inventory_lock = product.inventory_lock + log.qty_change
				product.save()

		return bundle

class RecordOrderActionsResource(ModelResource):
	action_person = fields.ForeignKey(EmployeeResource, 'action_person')
	new_status = fields.ForeignKey(RecordStatusResource, 'new_status', full = True)

	class Meta:
		queryset = RecordOrderActions.objects.all()
		resources_name = 'recordorderactions'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class PaymentMethodResource(ModelResource):
	class Meta:
		queryset = PaymentMethod.objects.all()
		resources_name = 'paymentmethod'
		list_allowed_methods = ['get']
		detail_allowed_methods = ['get']

		authentication = SessionAuthentication()
		authorization = Authorization()

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

class InvoiceResource(ModelResource):
	order = fields.ForeignKey(OrderResource,'order')
	payment_method = fields.ForeignKey(PaymentMethodResource, 'payment_method', full = True)
	invoice_address = fields.ForeignKey(AddressResource, 'invoice_address', full = True)

	class Meta:
		queryset = Invoice.objects.all()
		resources_name = 'invoice'
		list_allowed_methods = ['get', 'post', 'put', 'delete',]
		detail_allowed_methods = ['get', 'post', 'put', 'delete',]
		
		always_return_data = True

		ordering = ['id']

		authentication = SessionAuthentication()
		authorization = GuardianAuthorization()

		filtering = {
			'order' : ALL_WITH_RELATIONS,
			'invoice_id' : ALL_WITH_RELATIONS,
			'payment_method' : ALL_WITH_RELATIONS,
			'payment_status' : ALL_WITH_RELATIONS,
			'total_price' : ALL_WITH_RELATIONS,
		}

		excludes = ['reserved_col0',
		'reserved_col1',
		'reserved_col2',
		'reserved_col3',
		'reserved_col4',
		'reserved_col5',
		'reserved_col6',
		'reserved_col7',
		'reserved_col8',
		'reserved_col9',]

	def obj_create(self, bundle, request = None, **kwarg):

		bundle = super(InvoiceResource, self).obj_create(bundle, **kwarg)
		dt = date.today()
		uuid = u'I%5.5d%5.5d%5.5d%s' % (bundle.obj.order.customer.pk, bundle.obj.order.belong_to.pk, bundle.obj.pk, dt.strftime('%d%m%Y'))
		bundle.obj.invoice_id = uuid
		bundle.obj.printpdf()

		return bundle

	def obj_update(self, bundle, request = None, **kwarg):
		bundle = super(InvoiceResource, self).obj_update(bundle, **kwarg)
		bundle.obj.printpdf()

		return bundle
		
class SignupResource(ModelResource):
	class Meta:
		queryset = Employee.objects.all()
		resource_name = 'signup'
		always_return_data = True
		list_allowed_methods = ['post']

		authentication = Authentication()
		authorization = Authorization()

		excludes = ['password',
        'is_staff', 
        'is_superuser', 
        'date_joined',
        'last_login',]
		
	def obj_create(self, bundle, request = None, **kwarg):
		try:
			if bundle.data['username']:
				bundle = super(SignupResource, self).obj_create(bundle, **kwarg)
			else:
				bundle.data['username']=bundle.data['email']
				bundle = super(SignupResource, self).obj_create(bundle, **kwarg)
			bundle.obj.set_password(bundle.data.get('password'))
			bundle.obj.save()

		except IntegrityError:
			raise BadRequest('That username already exists')
		return bundle


	def prepend_urls(self):
		return [
			url(r"^(?P<resource_name>%s)/login%s$" %
				(self._meta.resource_name, trailing_slash()),
				self.wrap_view('login'), name="api_login"),
			url(r'^(?P<resource_name>%s)/logout%s$' %
				(self._meta.resource_name, trailing_slash()),
				self.wrap_view('logout'), name='api_logout'),
			url(r'^(?P<resource_name>%s)/checkusername%s$' %
				(self._meta.resource_name, trailing_slash()),
				self.wrap_view('checkusername'), name='api_checkusername'),
			url(r'^(?P<resource_name>%s)/checkemail%s$' %
				(self._meta.resource_name, trailing_slash()),
				self.wrap_view('checkemail'), name='api_checkemail'),
		]

	def login(self, request, **kwargs):
		self.method_check(request, allowed=['get','post'])

		#print request.POST

		#data = self.deserialize(request, request.raw_post_data, format=request.META.get('CONTENT_TYPE', 'application/json'))
		if request.method == 'POST':
			username = request.POST['username']
			password = request.POST['password']
			if User.objects.filter(username=username).count()==0:
				if User.objects.filter(email=username).count()>0:
					username=User.objects.get(email=username).username
			try:
				user = auth.authenticate(username=username, password=password)
			except:
				print "Unexpected error:", sys.exc_info()[0]
				raise

			if user:
				if user.is_active:
					auth.login(request, user)
					return self.create_response(request, {
						'success': True,
						'login_status': 'success',
					})
				else:
					return self.create_response(request, {
						'success': False,
						'login_status': 'invalid',
						})
			else:
				return self.create_response(request, {
					'success': False,
					'login_status': 'invalid',
					})
		elif request.method == 'GET':
			return self.create_response(request,{
				'username':request.user.username,
				'id':request.user.id,
				})

	def logout(self, request, **kwargs):
		self.method_check(request, allowed=['get'])
		if request.user and request.user.is_authenticated():
			auth.logout(request)
			return self.create_response(request, { 'success': True })
		else:
			return self.create_response(request, { 'success': False }, HttpUnauthorized)

	def checkusername(self, request, **kwargs):
		self.method_check(request, allowed=['post'])
		un = request.POST['username']
		if Employee.objects.filter(username = un).count():
			return self.create_response(request, { 'success': True, 'id': Employee.objects.get(username = un).pk})
		else:
			return self.create_response(request, { 'success': False })

	def checkemail(self, request, **kwargs):
		self.method_check(request, allowed=['post'])
		em = request.POST['email']
		if Employee.objects.filter(email = em).count():
			return self.create_response(request, { 'success': True, 'id': Employee.objects.get(email = em).pk })
		else:
			return self.create_response(request, { 'success': False })

class NewCompanyResource(ModelResource):
	sales_channel = fields.ForeignKey(SalesChannelResource, 'sales_channel', full = True)
	default_currency = fields.ForeignKey(CurrencyResource, 'default_currency', full = True)
	credit_currency = fields.ForeignKey(CurrencyResource, 'credit_currency', full = True)

	class Meta:
		queryset = Company.objects.all()
		resource_name = 'addcompany'
		always_return_data = True
		list_allowed_methods = ['get','post']

		authentication = MultiAuthentication(
			SessionAuthentication(),
			BasicAuthentication(),
			)
		authorization = Authorization()

		fields = ['name', 'email','phone', 'registration_no', 'vat_no','initial_creditAmount', 'credit_amount', 'is_paid_client']

	def obj_create(self, bundle, request = None, **kwarg):

		bundle.data['credit_currency'] = bundle.data['default_currency']
		bundle.data['initial_creditAmount'] = '-1.00'
		bundle.data['credit_amount'] = '-1.00'
		bundle.data['is_paid_client'] = u'True'

		bundle = super(NewCompanyResource, self).obj_create(bundle, **kwarg)
		bundle.obj.save()

		employee = Employee.objects.get(pk = bundle.request.user.pk)
		employee.employee_role = EmployeeRole.objects.filter(belong_to = bundle.obj).get(role = 'admin')
		employee.belong_to = bundle.obj

		try:
			if bundle.data['employee_phone']:
				employee.phone = bundle.data['employee_phone']
			if bundle.data['employee_id']:
				employee.employee_id = bundle.data['employee_id']
		except:
			pass

		employee.save()
		bundle.obj.save()

		return bundle
