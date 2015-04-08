from django.contrib.auth.models import User
from tastypie.test import ResourceTestCase
from db_tables.models import *
from guardian.shortcuts import get_objects_for_user
from guardian.core import ObjectPermissionChecker
from datetime import *


class SignupTest(ResourceTestCase):
	def setUp(self):
		super(SignupTest, self).setUp()

	def test_signup(self):
		print ''
		self.post_data = {
			'username': 'tianyi',
			'password': '123456',
			'email': 'cozytannic@gmail.com',
			'first_name': 'Tianyi',
			'last_name': 'Wu',
		}

		print 'testing user creation...'
		self.assertEqual(Employee.objects.count(), 0)
		self.assertHttpCreated(self.api_client.post('/api/v1/signup/', format = 'json', data = self.post_data))
		self.assertEqual(Employee.objects.count(), 1)

		channel = SalesChannel(channel_name = "normal")
		channel.save()

		currency = Currency(name = 'GBP', rate = '1.6')
		currency.save()

		country = Country(name = 'United Kingdom', prefix = '44')
		country.save()

		self.post_data = {
			'name' : 'testcase',
			'email' : 'volitation@abc.com',
			'phone' : '2342453',
			'registration_no' : "22342134",
			'address' : '',
			'sales_channel': '/api/v1/saleschannel/{0}/'.format(channel.pk),
			'default_currency': '/api/v1/currency/{0}/'.format(currency.pk),
			'employee_phone': '07955299706',
			'employee_id' : '2123123'
		}

		print 'testing company creation...'
		self.assertEqual(Company.objects.count(), 0)
		self.assertHttpCreated(self.api_client.post('/api/v1/addcompany/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456')))
		self.assertEqual(Company.objects.count(), 1)
		self.assertEqual(EmployeeRole.objects.count(), 5)



		self.post_data = {
			'first_line' : '304, Fathom Court',
			'second_line' : '',
			'city' : 'London',
			'country' : '/api/v1/country/{0}/'.format(country.pk),
			'is_default' : 'true',
			'zipcode' : 'E16 2FF',
			'company' : '/api/v1/company/{0}/'.format(Company.objects.get(name = 'testcase').pk)
		}



		print 'testing address creation...'



		self.assertEqual(Address.objects.count(), 0)
		self.assertHttpCreated(self.api_client.post('/api/v1/address/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456')))
		self.assertEqual(Address.objects.count(), 1)

		self.post_data = {
			'name' : 'testcase2',
			'email' : 'volitation@abc.com',
			'phone' : '2342453',
			'registration_no' : "22342134",
			'sales_channel': '/api/v1/saleschannel/{0}/'.format(channel.pk),
			'default_currency': '/api/v1/currency/{0}/'.format(currency.pk),
			'initial_creditAmount': '10000',
			'credit_currency': '/api/v1/currency/{0}/'.format(currency.pk),
		}




		print 'testing new client company creation...'




		self.assertEqual(Company.objects.count(), 1)
		self.assertHttpCreated(self.api_client.post('/api/v1/company/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456')))
		self.assertEqual(Company.objects.count(), 2)
		self.assertEqual(EmployeeRole.objects.count(), 5)

		company = Company.objects.get(name = 'testcase')
		role = EmployeeRole.objects.filter(belong_to = company).get(role = 'sales')
		self.post_data = {
			'username' : 'lillian',
			'password' : '123456',
			'employee_role' : '/api/v1/employeerole/{0}/'.format(role.pk)
		}



		print 'testing new employee creation...'



		self.assertEqual(Employee.objects.count(), 1)
		self.assertHttpCreated(self.api_client.post('/api/v1/employee/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456')))
		self.assertEqual(Employee.objects.count(), 2)

		self.api_client.client.logout()




		print 'testing new employee creation with new authentication...'




		role = EmployeeRole.objects.filter(belong_to = company).get(role = 'sales')
		self.post_data = {
			'username' : 'lillian2',
			'password' : '123456',
			'employee_role' : '/api/v1/employeerole/{0}/'.format(role.pk)
		}
		self.assertHttpUnauthorized(self.api_client.post('/api/v1/employee/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='lillian', password='123456')))




		print 'testing update user profile...'


		self.api_client.client.logout()

		role = EmployeeRole.objects.filter(belong_to = company).get(role = 'admin')
		user = Employee.objects.get(username = 'lillian')

		original_data = self.deserialize(
			self.api_client.get(
				'/api/v1/employee/{0}/'.format(user.pk),
				format='json', 
				authentication = self.api_client.client.login(username='lillian', password='123456')
				)
			)


		self.put_data = original_data.copy()
		self.put_data['employee_role'] = u'/api/v1/employeerole/{0}/'.format(role.pk)
		self.assertHttpOK(
			self.api_client.put(
				'/api/v1/employee/{0}/'.format(user.pk),
				format = 'json', 
				data = self.put_data, 
				authentication = self.api_client.client.login(username='lillian', password='123456')
				)
			)

		

		self.assertHttpOK(
			self.api_client.delete(
				'/api/v1/employee/{0}/'.format(user.pk),
				format = 'json', 
				authentication = self.api_client.client.login(username='lillian', password='123456')
				)
			)
		user = Employee.objects.get(username = 'lillian')
		print user.is_active


		print 'testing new product tags creation...'




		self.post_data = {
			'name' : 'art'
		}
		n = ProductTags.objects.count()
		self.assertHttpCreated(self.api_client.post('/api/v1/producttags/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='lillian', password='123456')))
		self.assertEqual(ProductTags.objects.count(), n+1)

class ProductTest(ResourceTestCase):
	def setUp(self):
		super(ProductTest, self).setUp()

		#create new user
		self.post_data = {
			'username': 'tianyi',
			'password': '123456',
			'email': 'cozytannic@gmail.com',
			'first_name': 'Tianyi',
			'last_name': 'Wu',
		}
		self.api_client.post('/api/v1/signup/', format = 'json', data = self.post_data)

		channel = SalesChannel(channel_name = "normal")
		channel.save()
		currency = Currency(name = 'GBP', rate = '1.6')
		currency.save()
		country = Country(name = 'United Kingdom', prefix = '44')
		country.save()

		self.post_data = {
			'name' : 'testcase',
			'email' : 'volitation@abc.com',
			'phone' : '2342453',
			'registration_no' : "22342134",
			'address' : '',
			'sales_channel': '/api/v1/saleschannel/{0}/'.format(channel.pk),
			'default_currency': '/api/v1/currency/{0}/'.format(currency.pk),
			'employee_phone': '07955299706',
			'employee_id' : '2123123'
		}
		self.api_client.post('/api/v1/addcompany/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456'))

		self.post_data = {
			'first_line' : '304, Fathom Court',
			'second_line' : '',
			'city' : 'London',
			'country' : '/api/v1/country/{0}/'.format(country.pk),
			'is_default' : 'true',
			'zipcode' : 'E16 2FF',
			'company' : '/api/v1/company/{0}/'.format(Company.objects.get(name = 'testcase').pk)
		}

		self.api_client.post('/api/v1/address/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456'))

		self.post_data = {
			'name' : 'testcase2',
			'email' : 'volitation@abc.com',
			'phone' : '2342453',
			'registration_no' : "22342134",
			'sales_channel': '/api/v1/saleschannel/{0}/'.format(channel.pk),
			'default_currency': '/api/v1/currency/{0}/'.format(currency.pk),
			'initial_creditAmount': '10000',
			'credit_currency': '/api/v1/currency/{0}/'.format(currency.pk),
		}

		self.api_client.post('/api/v1/company/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456'))

	def test_product(self):
		print ''
		status = ProductStatus(name = 'active')
		status.save()

		print 'testing product creation...'
		company = Company.objects.get(name = 'testcase')

		self.post_data = {
			'name' : 'TestProduct',
			'inventory_free' : 100,
			'rrp' : 20,
			'min_sale_price': 10,
			'tag' : [
				{
					'name' : 'art',
					'belong_to' :  '/api/v1/company/{0}/'.format(company.pk),
				},
				{
					'name' : 'science',
					'belong_to': '/api/v1/company/{0}/'.format(company.pk),
				}
			],
			'image' :[
				{
					'image' : '@logo.jpeg',
				}
			],
			'inventory_status': '/api/v1/productstatus/{0}/'.format(status.pk),
		}

		self.assertEqual(ProductTags.objects.count(), 0)
		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/product/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456'))
			)
		self.assertEqual(ProductTags.objects.count(), 2)
		
		print ProductImage.objects.first().image


		print 'testing product info update...'
		product = Product.objects.get(name = 'TestProduct')
		original_data = self.deserialize(
			self.api_client.get(
				'/api/v1/product/{0}/'.format(product.pk),
				format = 'json',
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456'))
			)

		self.put_data = original_data.copy()
		self.put_data['name'] = 'lalaal'
		self.assertHttpAccepted(
			self.api_client.put(
				'/api/v1/product/{0}/'.format(product.pk),
				format = 'json',
				data = self.put_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456'))
			)

		print 'testing purchase record creation...'
		company = Company.objects.get(name = 'testcase2')
		currency = Currency.objects.get(name = 'GBP')

		self.post_data = {
			'product' : '/api/v1/product/{0}/'.format(product.pk),
			'supplier' : '/api/v1/company/{0}/'.format(company.pk),
			'purchase_date' : '2013-11-20',
			'purchase_currency' : '/api/v1/currency/{0}/'.format(currency.pk),
			'purchase_qty' : 100,
			'anticipate_arrival_date' : '2014-1-1',
		}

		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/productpurchaserecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)

		print 'testing instock record creation...'

		record = ProductPurchaseRecord.objects.first()
		self.post_data = {
			'initial_instock_qty' : 95,
			'instock_date' : '2013-1-2',
			'product' : '/api/v1/product/{0}/'.format(product.pk),
			'purchase_record' : '/api/v1/productpurchaserecord/{0}/'.format(record.pk)
		}


		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/instockrecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)

		original_data = self.deserialize(
			self.api_client.get(
				'/api/v1/instockrecord/{0}/'.format(InstockRecord.objects.first().pk),
				format = 'json',
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')				
				)
			)

		self.put_data = original_data.copy()
		self.put_data['initial_instock_qty'] = 100
		self.assertHttpAccepted(
			self.api_client.put(
				'/api/v1/instockrecord/{0}/'.format(InstockRecord.objects.first().pk),
				format = 'json',
				data = self.put_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)

class OrderTest(ResourceTestCase):
	def setUp(self):
		super(OrderTest, self).setUp()

		#create new user
		self.post_data = {
			'username': 'tianyi',
			'password': '123456',
			'email': 'cozytannic@gmail.com',
			'first_name': 'Tianyi',
			'last_name': 'Wu',
		}
		self.api_client.post('/api/v1/signup/', format = 'json', data = self.post_data)

		channel = SalesChannel(channel_name = "normal")
		channel.save()
		currency = Currency(name = 'GBP', rate = '1.6')
		currency.save()
		country = Country(name = 'United Kingdom', prefix = '44')
		country.save()

		self.post_data = {
			'name' : "TestCase Co. Ltd",
			'email' : 'volitation@abc.com',
			'phone' : '2342453',
			'registration_no' : "22342134",
			'address' : '',
			'sales_channel': '/api/v1/saleschannel/{0}/'.format(channel.pk),
			'default_currency': '/api/v1/currency/{0}/'.format(currency.pk),
			'employee_phone': '07955299706',
			'employee_id' : '2123123'
		}
		self.api_client.post('/api/v1/addcompany/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456'))

		self.post_data = {
			'first_line' : '304, Fathom Court',
			'second_line' : '2 Basin Approach',
			'city' : 'London',
			'country' : '/api/v1/country/{0}/'.format(country.pk),
			'is_default' : 'true',
			'zipcode' : 'E16 2FF',
			'company' : '/api/v1/company/{0}/'.format(Company.objects.get(name = 'TestCase Co. Ltd').pk)
		}

		self.api_client.post('/api/v1/address/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456'))

		self.post_data = {
			'name' : 'testcase2',
			'email' : 'volitation@abc.com',
			'phone' : '2342453',
			'registration_no' : "22342134",
			'sales_channel': '/api/v1/saleschannel/{0}/'.format(channel.pk),
			'default_currency': '/api/v1/currency/{0}/'.format(currency.pk),
			'initial_creditAmount': '10000',
			'credit_currency': '/api/v1/currency/{0}/'.format(currency.pk),
		}

		self.api_client.post('/api/v1/company/', 
			format = 'json', 
			data = self.post_data, 
			authentication=self.api_client.client.login(username='tianyi', password='123456'))

		status = ProductStatus(name = 'active')
		status.save()

		self.post_data = {
			'pid' : 'PXDT00123',
			'name' : 'TestProduct',
			'inventory_free' : 100,
			'rrp' : 20,
			'min_sale_price': 10,
			'tag' : [
				{
					'name' : 'art',
					'belong_to' :  '/api/v1/company/1/',
				},
				{
					'name' : 'science',
					'belong_to': '/api/v1/company/1/',
				}
			],
			'inventory_status': '/api/v1/productstatus/{0}/'.format(status.pk),
		}

		self.api_client.post(
			'/api/v1/product/',
			format = 'json',
			data = self.post_data,
			authentication = self.api_client.client.login(username = 'tianyi', password = '123456'))

	def test_order(self):
		status = OrderStatus(name = 'pending')
		status.save()
		status = OrderStatus(name = 'picking up')
		status.save()
		status = OrderStatus(name = 'ready to ship')
		status.save()
		status = OrderStatus(name = 'shipped')
		status.save()
		status = OrderStatus(name = 'invoiced')
		status.save()
		status = OrderStatus(name = 'completed')
		status.save()
		status = OrderStatus(name = 'cancel')
		status.save()

		status = RecordStatus(name = 'pending')
		status.save()
		status = RecordStatus(name = 'confirmed')
		status.save()
		status = RecordStatus(name = 'picked up')
		status.save()	
		status = RecordStatus(name = 'cancel')
		status.save()	

		print 'testing order creation...'

		customer = Company.objects.get(name = 'testcase2')
		employee = Employee.objects.first()
		now = datetime.now()
		nowstr = now.strftime('%Y-%m-%d %H:%M:%S')
		self.post_data = {
			'customer' : '/api/v1/company/{0}/'.format(customer.pk),
			'date' : nowstr,
			'sales' : '/api/v1/employee/{0}/'.format(employee.pk),
			'delivery_address' : '/api/v1/address/{0}/'.format(Address.objects.first().pk),
			'status' : '/api/v1/orderstatus/{0}/'.format(OrderStatus.objects.get(name = 'pending').pk),
		}

		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/order/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)

		print 'testing add order records...'
		self.post_data = {
			'product' : '/api/v1/product/{0}/'.format(Product.objects.first().pk),
			'quantity' : '20',
			'discount_percentage' : '60',
			'status' : '/api/v1/recordstatus/{0}/'.format(RecordStatus.objects.get(name = 'pending').pk),
			'owner' : '/api/v1/order/{0}/'.format(Order.objects.first().pk)
		}
		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/orderrecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)
		self.assertEqual(Product.objects.first().inventory_free, 80)



		print 'testing order record update...'
		original_data = self.deserialize(
			self.api_client.get(
				'/api/v1/orderrecord/{0}/'.format(RecordOrder.objects.first().pk),
				format='json',
				authentication = self.api_client.client.login(username='tianyi', password='123456')
				)
			)
		self.put_data = original_data.copy()
		self.put_data['quantity'] = 40
		self.put_data['status'] = '/api/v1/recordstatus/{0}/'.format(RecordStatus.objects.get(name = 'cancel').pk)
		
		self.assertHttpAccepted(
			self.api_client.put(
				'/api/v1/orderrecord/1/',
				format = 'json',
				data = self.put_data,
				authentication = self.api_client.client.login(username='tianyi', password='123456')				
				)
			)

		self.assertEqual(Product.objects.first().inventory_free, 100)

		self.post_data['status'] = '/api/v1/recordstatus/{0}/'.format(RecordStatus.objects.get(name = 'picked up').pk)
		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/orderrecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)
		self.assertEqual(Product.objects.first().inventory_free, 80)
		self.assertEqual(Product.objects.first().inventory_lock, 20)



		print 'testing purchase record creation...'
		company = Company.objects.get(name = 'testcase2')
		currency = Currency.objects.get(name = 'GBP')
		product = Product.objects.first()

		self.post_data = {
			'product' : '/api/v1/product/{0}/'.format(product.pk),
			'supplier' : '/api/v1/company/{0}/'.format(company.pk),
			'purchase_date' : '2013-11-20',
			'purchase_currency' : '/api/v1/currency/{0}/'.format(currency.pk),
			'purchase_qty' : 100,
			'anticipate_arrival_date' : '2014-1-1',
		}

		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/productpurchaserecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)

		print 'testing instock record creation...'

		record = ProductPurchaseRecord.objects.first()
		self.post_data = {
			'initial_instock_qty' : 95,
			'instock_date' : '2013-1-2',
			'product' : '/api/v1/product/{0}/'.format(product.pk),
			'purchase_record' : '/api/v1/productpurchaserecord/{0}/'.format(record.pk)
		}


		self.assertHttpCreated(
			self.api_client.post(
				'/api/v1/instockrecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)
			)


		print 'testing order update....'
		order = Order.objects.first()
		original_data = self.deserialize(
			self.api_client.get(
				'/api/v1/order/{0}/'.format(order.pk),
				format='json',
				authentication = self.api_client.client.login(username='tianyi', password='123456')
				)
			)
		print original_data
		self.put_data = original_data.copy()

		self.put_data['status'] = '/api/v1/orderstatus/{0}/'.format(OrderStatus.objects.get(name = 'shipped').pk)
		
		self.assertHttpOK(
			self.api_client.put(
				'/api/v1/order/{0}/'.format(order.pk),
				format = 'json',
				data = self.put_data,
				authentication = self.api_client.client.login(username='tianyi', password='123456')				
				)
			)

		self.assertEqual(Product.objects.first().inventory_lock, 0)
		self.assertEqual(InstockRecord.objects.first().available_qty, 75)



		self.post_data = {
			'product' : '/api/v1/product/{0}/'.format(Product.objects.first().pk),
			'quantity' : '2',
			'discount_percentage' : '60',
			'status' : '/api/v1/recordstatus/{0}/'.format(RecordStatus.objects.get(name = 'pending').pk),
			'owner' : '/api/v1/order/{0}/'.format(Order.objects.first().pk)
		}
		for i in range(30):
			self.post_data['discount_percentage'] = i
			self.api_client.post(
				'/api/v1/orderrecord/',
				format = 'json',
				data = self.post_data,
				authentication = self.api_client.client.login(username = 'tianyi', password = '123456')
				)


		now = datetime.now()
		nowstr = now.strftime('%Y-%m-%d')
		self.post_data = {
			'order' : '/api/v1/order/{0}/'.format(order.pk),
			'total_price' : 240,
			'payment_status' : 0,
			'VAT_rate' : 20,
			'invoice_address' : '/api/v1/address/{0}/'.format(Address.objects.first().pk),
			'tax_date' : nowstr,
			'comment' : 'BSDAFSGJGKJHGFDSAADSF\r\n123123ERTHGFSDAFGSDHFSA'
		}

		self.api_client.post(
			'/api/v1/invoice/',
			format = 'json',
			data = self.post_data,
			authentication = self.api_client.client.login(username='tianyi', password='123456'),
			)

		self.put_data['status'] = '/api/v1/orderstatus/{0}/'.format(OrderStatus.objects.get(name = 'cancel').pk)
		
		self.assertHttpOK(
			self.api_client.put(
				'/api/v1/order/{0}/'.format(order.pk),
				format = 'json',
				data = self.put_data,
				authentication = self.api_client.client.login(username='tianyi', password='123456')				
				)
			)
		self.assertEqual(Product.objects.first().inventory_free, 135)





