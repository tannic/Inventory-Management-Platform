from django.db import models
from django.contrib.auth.models import User as BaseUser
from django.contrib.auth.models import *
from django.contrib import admin
from guardian.shortcuts import assign_perm
from guardian.shortcuts import remove_perm
from django.db import IntegrityError
import sys

from tastypie.models import create_api_key



class Currency(models.Model):
	name = models.CharField(max_length=255)

	#rate to dollar
	rate = models.DecimalField(max_digits=10, decimal_places=4)
	
	symbol = models.CharField(max_length=255, blank = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(Currency, self).save(*args, **kwargs)
		group_set = Group.objects.all()
		for g in group_set:
			assign_perm('view_permission_code', g, self)

	def __unicode__(self):
		return self.name

class Country(models.Model):
	name = models.CharField(max_length=255)
	prefix = models.CharField(max_length=255)
	default_currency=models.ForeignKey(Currency)

	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(Country, self).save(*args, **kwargs)
		group_set = Group.objects.all()
		for g in group_set:
			assign_perm('view_permission_code', g, self)

	def __unicode__(self):
		return self.name

class SalesChannel(models.Model):
	channel_name = models.CharField(max_length=255)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)
	
	def save(self, *args, **kwargs):
		super(SalesChannel, self).save(*args, **kwargs)
		group_set = Group.objects.all()
		for g in group_set:
			assign_perm('view_permission_code', g, self)

	def __unicode__(self):
		return self.channel_name
	
# Company
class Company(models.Model):
	name = models.CharField(max_length = 255)
	sales_channel = models.ForeignKey(SalesChannel)

	# at least to have email or phone is must 
	email = models.EmailField(max_length = 255, blank = True)
	phone = models.CharField(max_length = 255, blank = True)

	#registration number from Company House for invoice creation
	registration_no = models.CharField(max_length = 255, blank = True, default = '')
	vat_no = models.CharField(max_length = 255, blank = True, default = '')
	default_currency = models.ForeignKey(Currency)

	# refer to who creates this company info
	belong_to = models.ForeignKey('self', blank = True, null = True)
	
	# credit info to manage pre-paid client or paid-deliver clients
	# for example if credit client we can add 1m pound to identify a credit client
	initial_creditAmount = models.DecimalField(max_digits=10, decimal_places=2)
	
	# credit amount left
	credit_amount = models.DecimalField(max_digits=10, decimal_places=2)
	credit_currency = models.ForeignKey(Currency, related_name = 'credit_currency')

	# is a paid client of us
	is_paid_client = models.BooleanField() 
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
		
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):

		super(Company, self).save(*args, **kwargs)
		print self.is_paid_client
		
		if self.is_paid_client == 'True':
			self.belong_to = self
			super(Company, self).save(*args, **kwargs)

		# automatically generate employeerole
		if self.is_paid_client == 'True' and (self.pk is None):
			role = EmployeeRole(name = "abc", role = 'account', belong_to = self)
			role.save()
			role = EmployeeRole(name = "abc", role = 'admin', belong_to = self)
			role.save()
			role = EmployeeRole(name = "abc", role = 'mgr', belong_to = self)
			role.save()
			role = EmployeeRole(name = "abc", role = 'invenmgr', belong_to = self)
			role.save()
			role = EmployeeRole(name = "abc", role = 'sales', belong_to = self)
			role.save()

		elif self.is_paid_client == 'True':
			if (not EmployeeRole.objects.filter(belong_to = self)):
				role = EmployeeRole(name = "abc", role = 'account', belong_to = self)
				role.save()
				role = EmployeeRole(name = "abc", role = 'admin', belong_to = self)
				role.save()
				role = EmployeeRole(name = "abc", role = 'mgr', belong_to = self)
				role.save()
				role = EmployeeRole(name = "abc", role = 'invenmgr', belong_to = self)
				role.save()
				role = EmployeeRole(name = "abc", role = 'sales', belong_to = self)
				role.save()				

		role_set = EmployeeRole.objects.filter(belong_to = self.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role == 'admin':
				assign_perm('delete_permission_code', g, self)
			if r.role != 'account':
				assign_perm('create_permission_code', g, self)
				assign_perm('update_permission_code', g, self)
		annoyuser = User.objects.get(id = -1)
		assign_perm('view_permission_code', annoyuser, self)

	def __unicode__(self):
		return self.name

class Address(models.Model):
	first_line = models.CharField(max_length=255)
	second_line = models.CharField(max_length=255, blank = True, null = True)
	city = models.CharField(max_length=255)
	country = models.ForeignKey(Country)
	zipcode = models.CharField(max_length=255)

	is_default = models.BooleanField()
	company = models.ForeignKey(Company)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		if self.is_default:
			ads = Address.objects.filter(company=self.company)
			for ad in ads:
				ad.is_default = False
				ad.save()
				
		super(Address, self).save(*args, **kwargs)

		owner = self.company.belong_to
		role_set = EmployeeRole.objects.filter(belong_to = self.company.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role != 'account':
				assign_perm ('create_permission_code', g, self)
				assign_perm ('delete_permission_code', g, self)
				assign_perm ('update_permission_code', g, self)

	def __unicode__(self):
		return u'%s %s' % (self.first_line, self.zipcode)

# Employee part
class EmployeeRole(Group):
	ROLE_CHOICES = (
		('sales', 'Sales Representative'),
		('admin', 'Administrator'),
		('mgr', 'General Manager'),
		('invenmgr', 'Inventory Manager'),
		('account', 'Accountant'),
		)
	role = models.CharField(max_length = 30, choices = ROLE_CHOICES,)
	description = models.CharField(max_length = 255, null = True, blank = True)
	belong_to = models.ForeignKey(Company)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		self.name = u'%s %s' %  (self.role, self.belong_to.id)
		if self.role=='sales':
			self.description = 'Sales Representative'
		elif self.role == 'admin':
			self.description = 'Administrator'
		elif self.role == 'mgr':
			self.description ='General Manager'
		elif self.role == 'invenmgr':
			self.description = 'Inventory Manager'
		elif self.role == 'account':
			self.description = 'Accountant'

		super(EmployeeRole, self).save(*args, **kwargs)
		
		# Assign authorization & permissions for each model based on role and company
		
		group = Group.objects.get(id = self.id)

		# Country : every can view, no one can modify
		country_set = Country.objects.all()
		for c in country_set:
			assign_perm('view_permission_code', group, c)

		# Currency: every can view, no one can modify
		currency_set = Currency.objects.all()
		for c in currency_set:
			assign_perm('view_permission_code', group, c)

		# SalesChannel: every can view, no one can modify
		channel_set = SalesChannel.objects.all()
		for c in channel_set:
			assign_perm('view_permission_code', group, c)

		# Company: only admin can delete, others can modify companys that belong to their employer
		company_set = Company.objects.filter(belong_to = self.belong_to)
		if self.role != 'account':
			perm = Permission.objects.get(codename = 'add_company')
			group.permissions.add(perm)

		for c in company_set:
			assign_perm('view_permission_code', group, c)
			if self.role == 'admin':
				assign_perm('delete_permission_code', group, c)
			if self.role != 'account':
				assign_perm('create_permission_code', group, c)
				assign_perm('update_permission_code', group, c)

		# Address: every can view addresses related to their employer. sales, admin and mgr can modify.
		if self.role == 'admin' or self.role == 'sales' or self.role == 'mgr' or self.role == 'invenmgr':
			perm = Permission.objects.get(codename = 'add_address')
			group.permissions.add(perm)
			#print perm

		for c in company_set:
			address_set = Address.objects.filter(company = c)
			for a in address_set:
				assign_perm('view_permission_code', group, a)
				if self.role == 'admin' or self.role == 'sales' or self.role == 'mgr' or self.rol == 'invenmgr':
					assign_perm('create_permission_code', group, a)
					assign_perm('update_permission_code', group, a)
					assign_perm('delete_permission_code', group, a)

		# Employee: everyone except admin and mgr can only view their own info
		employee_set = Employee.objects.filter(belong_to = self.belong_to)
		if self.role == 'admin' or self.role == 'mgr':
			perm = Permission.objects.get(codename = 'add_employee')
			group.permissions.add(perm)

		for e in employee_set:
			assign_perm('view_permission_code', group, e)
			if self.role == 'admin' or self.role == 'mgr':
				assign_perm('create_permission_code', group, e)
				assign_perm('update_permission_code', group, e)
				assign_perm('delete_permission_code', group, e)

		# EmployeeRole: everyone can only view
		employeerole_set = EmployeeRole.objects.filter(belong_to = self.belong_to)
		for e in employeerole_set:
			g = Group.objects.get(pk = e.pk)
			assign_perm('view_permission_code', group, e)
			assign_perm('view_permission_code', g, self)

		# ProductTag: everyone can view and create. admin can also delete.
		tag_set = ProductTags.objects.filter(belong_to = self.belong_to)

		perm = Permission.objects.get(codename = 'add_producttags')
		group.permissions.add(perm)
		#print perm

		for t in tag_set:
			assign_perm('view_permission_code', group, t)
			assign_perm('create_permission_code', group, t)

			if self.role == 'admin':
				assign_perm('delete_permission_code', group, t)

		# ProductStatus: everyone can only view.
		productstatus_set = ProductStatus.objects.all()
		for p in productstatus_set:
			assign_perm('view_permission_code', group, p)

		# Product: everyone can only view products of their company. admin & mgr can modify.
		product_set = Product.objects.filter(belong_to = self.belong_to)

		if self.role == 'admin' or self.role == 'mgr':
			perm = Permission.objects.get(codename = 'add_product')
			group.permissions.add(perm)
			#print perm

		if self.role == 'admin' or self.role == 'mgr' or self.role == 'invenmgr':
			perm = Permission.objects.get(codename = 'add_productpurchaserecord')
			group.permissions.add(perm)
			#print perm

		if self.role == 'admin' or self.role == 'mgr' or self.role == 'invenmgr':
			perm = Permission.objects.get(codename = 'add_instockrecord')
			group.permissions.add(perm)

		if self.role == 'admin' or self.role == 'mgr' or self.role == 'invenmgr':
			perm = Permission.objects.get(codename = 'add_productimage')
			group.permissions.add(perm)

		for p in product_set:
			assign_perm('view_permission_code', group, p)
			if self.role == 'admin' or self.role == 'mgr':
				assign_perm('create_permission_code', group, p)
				assign_perm('update_permission_code', group, p)
				assign_perm('delete_permission_code', group, p)

		# ProductPurchaseRecord: only invenmgr, admin, mgr can view or create

			productpurchaserecord_set = ProductPurchaseRecord.objects.filter(product = p)
			for ppr in productpurchaserecord_set:
				if self.role == 'admin' or self.role == 'mgr' or self.role == 'invenmgr':
					assign_perm('create_permission_code', group, ppr)
					assign_perm('view_permission_code', group, ppr)
					assign_perm('update_permission_code', group, ppr)

			instockrecord_set = InstockRecord.objects.filter(product = p)
			for ppr in instockrecord_set:
				if self.role == 'admin' or self.role == 'mgr' or self.role == 'invenmgr':
					assign_perm('create_permission_code', group, ppr)
					assign_perm('view_permission_code', group, ppr)
					assign_perm('update_permission_code', group, ppr)

		# OrderStatus: everyone can only view
		orderstatus_set = OrderStatus.objects.all()
		for o in orderstatus_set:
			assign_perm('view_permission_code', group, o)

		# Order: everyone can view. admin, mgr and sales can modify
		if self.role != 'invenmgr' and self.role != 'account':
			perm = Permission.objects.get(codename = 'add_order')
			group.permissions.add(perm)
			#print perm

		if self.role != 'invenmgr' and self.role != 'account':
			perm = Permission.objects.get(codename = 'add_recordorder')
			group.permissions.add(perm)
			#print perm

		if self.role == 'mgr' or self.role == 'admin' or self.role == 'sales':
			perm = Permission.objects.get(codename = 'add_invoice')
			group.permissions.add(perm)
			#print perm

		order_set = Order.objects.filter(belong_to = self.belong_to)
		for o in order_set:
			assign_perm('view_permission_code', group, o)
			if self.role != 'invenmgr' and self.role != 'account':
				assign_perm('create_permission_code', group, o)
				assign_perm('update_permission_code', group, o)
				assign_perm('delete_permission_code', group, o)

		# RecordOrder: everyone can view. admin, mgr and sales can modify
			orderrecord_set = RecordOrder.objects.filter(owner = o)
			for r in orderrecord_set:
				assign_perm('view_permission_code', group, r)
				if self.role != 'invenmgr' and self.role != 'account':
					assign_perm('create_permission_code', group, r)
					assign_perm('update_permission_code', group, r)
					assign_perm('delete_permission_code', group, r)

		# RecordOrderActions: only mgr and admin can view
				action_set = RecordOrderActions.objects.filter(request_record = r)
				for a in action_set:
					if self.role == 'mgr' or self.role == 'admin':
						assign_perm('view_permission_code', group, a)

		#Invoice: every can only view. sales, admin and mgr can modify
			invoice_set = Invoice.objects.filter(order = o)
			for i in invoice_set:
				assign_perm('view_permission_code', group, i)
				if self.role == 'mgr' or self.role == 'admin' or self.role == 'sales':
					assign_perm('create_permission_code', group, i)
					assign_perm('update_permission_code', group, i)
					


		# RecordStatus: everyone can view
		record_set = RecordStatus.objects.all()
		for r in record_set:
			assign_perm('view_permission_code', group, r)

	def __unicode__(self):
		return u'%s %s' % (self.name, self.belong_to.name)

class Employee(BaseUser):

	employee_id = models.CharField(max_length=255, blank = True, null = True)
	
	# refer to who creates this company info
	employee_role = models.ForeignKey(EmployeeRole, blank = True, null = True)

	belong_to = models.ForeignKey(Company, blank = True, null = True)

	phone = models.CharField(max_length=255, blank = True, null = True)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(Employee, self).save(*args, **kwargs)
		user = User.objects.get(id = self.id)
		if self.employee_role:
			user.groups.add(self.employee_role)
		assign_perm('view_permission_code', user, self)
		assign_perm('update_permission_code', user, self)

		role_set = EmployeeRole.objects.filter(belong_to = self.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role == 'admin' or r.role == 'mgr':			
				assign_perm('create_permission_code', g, self)
				assign_perm('update_permission_code', g, self)

	def __unicode__(self):
		return self.username

models.signals.post_save.connect(create_api_key, sender=Employee)

# Product
class ProductTags(models.Model):
	name = models.CharField(max_length=255)
	
	# refer to who creates this company info
	belong_to = models.ForeignKey(Company)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)
	
	def save(self, *args, **kwargs):
		super(ProductTags, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.filter(belong_to = self.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role == 'sales' or r.role == 'admin' or r.role == 'mgr':
				assign_perm('create_permission_code', g, self)
				assign_perm('delete_permission_code', g, self)

	def __unicode__(self):
		return self.name
	
class ProductStatus(models.Model):
	name = models.CharField(max_length=255)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(ProductStatus, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.all()
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
		

	def __unicode__(self):
		return self.name

class Product(models.Model):
	# General product name such as paint
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	
	# Storage 
	inventory_free = models.IntegerField()
	inventory_lock = models.IntegerField()
	min_qty = models.IntegerField(blank=True, null = True)
	is_fifo = models.BooleanField(default = True)
	
	# Product ID which identifies a kind of product for internal use
	pid = models.CharField(max_length=255, blank=True, null = True)

	# How long does it takes to deliver
	leadtime = models.IntegerField(blank=True, null = True)

	# n:n tag for products
	tag = models.ManyToManyField(ProductTags, blank=True, null = True)

	# recommended retail price
	rrp = models.DecimalField(max_digits=10, decimal_places=2)

	min_sale_price = models.DecimalField(max_digits=10, decimal_places=2)

	inventory_status = models.ForeignKey(ProductStatus)

	# unit: days
	valid_period = models.IntegerField(blank = True, null = True)

	# refer to who creates this company info
	belong_to = models.ForeignKey(Company)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(Product, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.filter(belong_to = self.belong_to)
		for r in role_set:
			g = Group.objects.get (id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role == 'admin' or r.role == 'mgr':
				assign_perm('create_permission_code', g, self)
				assign_perm('update_permission_code', g, self)
				assign_perm('delete_permission_code', g, self)


	def __unicode__(self):
		return self.name

class ProductImage(models.Model):
	image = models.ImageField(upload_to = 'product')
	owner = models.ForeignKey(Product, null=True, blank=True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(ProductImage, self).save(*args, **kwargs)
		try:
			role_set = EmployeeRole.objects.filter(belong_to = self.owner.belong_to)
			for r in role_set:
				g = Group.objects.get (id = r.id)
				assign_perm('view_permission_code', g, self)
				if r.role == 'admin' or r.role == 'mgr':
					assign_perm('create_permission_code', g, self)
					assign_perm('update_permission_code', g, self)
					assign_perm('delete_permission_code', g, self)
		except:
			pass

class ProductPurchaseRecord(models.Model):
	product = models.ForeignKey(Product)
	
	# purchase related info
	supplier = models.ForeignKey(Company,related_name='supplier_company', null = True)
	purchase_id = models.CharField(max_length=255,blank=True, null = True)
	purchase_date = models.DateField('%Y-%m-%d')
	purchase_currency = models.ForeignKey(Currency)
	purchase_price = models.DecimalField(max_digits=10, decimal_places=2, blank = True, null = True)
	purchase_qty = models.IntegerField()

	anticipate_arrival_date = models.DateField('%Y-%m-%d',blank = True, null = True)

	comment = models.CharField(max_length=255, blank = True, null = True)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)
	
	def save(self, *args, **kwargs):
		super(ProductPurchaseRecord, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.filter(belong_to = self.product.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			if r.role == 'admin' or r.role =='mgr' or r.role == 'invenmgr':
				assign_perm('view_permission_code', g, self)
				assign_perm('create_permission_code', g, self)
			if r.role == 'admin' or r.role =='mgr':
				assign_perm('update_permission_code', g, self)

	def __unicode__(self):
		return self.product.name

class InstockRecord(models.Model):
	# inventory manager related info
	initial_instock_qty = models.IntegerField()
	available_qty = models.IntegerField(blank = True, null = True,)
	instock_date = models.DateField('%Y-%m-%d')
	comment = models.CharField(max_length=255, blank = True, null = True)

	product = models.ForeignKey(Product)

	purchase_record = models.ForeignKey(ProductPurchaseRecord, blank = True, null = True)

	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		if not self.available_qty:
			super(InstockRecord, self).save(*args, **kwargs)
		elif int(self.initial_instock_qty) < int(self.available_qty):
			raise IntegrityError()
		else:
			super(InstockRecord, self).save(*args, **kwargs)

		role_set = EmployeeRole.objects.filter(belong_to = self.product.belong_to)

		for r in role_set:
			g = Group.objects.get(id = r.id)
			if r.role == 'admin' or r.role =='mgr' or r.role == 'invenmgr':
				assign_perm('view_permission_code', g, self)
				assign_perm('create_permission_code', g, self)
			if r.role == 'admin' or r.role =='mgr':
				assign_perm('update_permission_code', g, self)

	def __unicode__(self):
		return self.product.name

class InstockRecordLog(models.Model):

	record = models.ForeignKey(InstockRecord)
	initial_instock_qty_change = models.IntegerField()
	available_qty_change = models.IntegerField()
	date = models.DateTimeField('%Y-%m-%d %H:%M:%S',)
	person = models.ForeignKey(Employee)

	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(InstockRecordLog, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.filter(belong_to = self.person.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			if r.role == 'admin' or r.role =='mgr' or r.role == 'invenmgr':
				assign_perm('view_permission_code', g, self)


# orders
# status:
# 1. pending
# 2. picking up
# 3. ready to ship
# 4. shipped
# 5. invoiced
# 6. completed
# 7. cancel
class OrderStatus(models.Model):
	name = models.CharField(max_length = 30)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(OrderStatus, self).save(*args, **kwargs)
		role_set = Group.objects.all()
		for r in role_set:
			assign_perm('view_permission_code', r, self)

	def __unicode__(self):
		return self.name

class Order(models.Model):
	# universal unique order id = clientID + CustomerID + OrderID + Product + Purchse_Date
	uuid = models.CharField(max_length=255, null = True, blank = True)

	customer = models.ForeignKey(Company, related_name='customer_company')
	date = models.DateTimeField('%Y-%m-%d %H:%M:%S',)
	sales = models.ForeignKey(Employee)

	delivery_address = models.ForeignKey(Address)
	status = models.ForeignKey(OrderStatus)
	comment = models.CharField(max_length = 255, null = True, blank = True)

	belong_to = models.ForeignKey(Company, null = True, blank = True)
	
	createdate = models.DateTimeField('%Y-%m-%d %H:%M:%S', blank = True, null = True)
	completedate = models.DateTimeField('%Y-%m-%d %H:%M:%S', blank = True, null = True)

	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(Order, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.filter(belong_to = self.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role == 'admin' or r.role == 'mgr' or r.role == 'invenmgr' or r.role == 'sales':
				assign_perm('create_permission_code', g, self)
				assign_perm('update_permission_code', g, self)
				assign_perm('delete_permission_code', g, self)
				if self.status.name == 'cancel':
					remove_perm('create_permission_code', g, self)
					remove_perm('update_permission_code', g, self)
					remove_perm('delete_permission_code', g, self)					

		records = RecordOrder.objects.filter(owner = self)
		for r in records:
			r.save()
	
	def total_price(self):
		records = RecordOrder.objects.filter(owner = self)
		ttl = 0
		for r in records:
			ttl = ttl + r.subtotal()
		return ttl

	def __unicode__(self):
		return u'%s %s' % (self.customer.name, self.date)

# status:
# 1. pending
# 2. confirmed
# 3. picked up
# 4. cancel
class RecordStatus(models.Model):
	# prepickup, picking up, suspend and etc
	name = models.CharField(max_length = 30)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(RecordStatus, self).save(*args, **kwargs)
		group_set = Group.objects.all()
		for g in group_set:
			assign_perm('view_permission_code', g, self)

	def __unicode__(self):
		return self.name

class RecordOrder(models.Model):
	product = models.ForeignKey(Product)
	quantity = models.IntegerField()
	discount_percentage = models.DecimalField(max_digits=2, decimal_places=0)
	
	# current record status
	status = models.ForeignKey(RecordStatus)

	owner = models.ForeignKey(Order, null = True, blank = True)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def subtotal(self):
		return self.product.rrp*self.quantity*self.discount_percentage/100

	def save(self, *args, **kwargs):
		super(RecordOrder, self).save(*args, **kwargs)

		#try:
		if self.owner:
			role_set = EmployeeRole.objects.filter(belong_to = self.owner.belong_to)
			for r in role_set:
				g = Group.objects.get(id = r.id)
				assign_perm('view_permission_code', g, self)
				#if self.status.name == 'cancel':
				#	remove_perm('view_permission_code', g, self)

				if r.role == 'admin' or r.role == 'invenmgr' or r.role == 'sales' or r.role == 'mgr':
					assign_perm('create_permission_code', g, self)
					assign_perm('update_permission_code', g, self)
					#assign_perm('delete_permission_code', g ,self)
					if self.status.name == 'cancel':
						remove_perm('update_permission_code', g, self)
						remove_perm('delete_permission_code', g, self)
		#except:
			#print "Unexpected error:", sys.exc_info()[0]
			#pass


	
	def __unicode__(self):
		return u'%s  %s  %s' % (self.product.name, self.quantity, self.discount_percentage)

class RecordOrderActions(models.Model):
	request_record = models.ForeignKey(RecordOrder)
	
	# record contents changed
	qty_change = models.IntegerField()
	discount_change = models.DecimalField(max_digits=2, decimal_places=0)
	new_status = models.ForeignKey(RecordStatus)
	
	# trace info
	action_person = models.ForeignKey(Employee)
	action_date = models.DateTimeField('%Y-%m-%d %H:%M:%S',)
	comment = models.TextField(blank = True)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)
	
	def save(self, *args, **kwargs):
		super(RecordOrderActions, self).save(*args, **kwargs)
		company = self.request_record.owner.belong_to
		role_set = EmployeeRole.objects.filter(belong_to = company)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			if r.role == 'mgr' or r.role == 'admin':
				assign_perm('view_permission_code', g, self)

	def __unicode__(self):
		return self.request_record.product.name

class PaymentMethod(models.Model):
	name = models.CharField(max_length = 255)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)

	def save(self, *args, **kwargs):
		super(PaymentMethod, self).save(*args, **kwargs)
		group_set = Group.objects.all()
		for g in group_set:
			assign_perm('view_permission_code', g, self)

	def __unicode__(self):
		return self.name

class Invoice(models.Model):
	invoice_id = models.CharField(max_length=255, blank = True, null = True)
	order = models.ForeignKey(Order)
	total_price = models.DecimalField(max_digits=10, decimal_places=2)
	payment_method = models.ForeignKey(PaymentMethod, blank = True, null = True)
	payment_status = models.BooleanField()
	VAT_rate = models.DecimalField(max_digits = 2, decimal_places = 0)
	tax_date = models.DateField('%Y-%m-%d', blank = True, null = True)
	term_days = models.IntegerField(blank = True, null = True)
	invoice_address = models.ForeignKey(Address, blank = True, null = True)
	pdffile = models.FileField(upload_to = 'invoice', blank = True, null = True)
	comment = models.TextField(blank = True, null = True)
	
	reserved_col0 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col1 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col2 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col3 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col4 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col5 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col6 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col7 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col8 = models.CharField(max_length=255, blank = True, null = True)
	reserved_col9 = models.CharField(max_length=255, blank = True, null = True)

	class Meta:
		permissions = (("view_permission_code", 'can_view'),
			("create_permission_code", 'can_create'),
			("update_permission_code", 'can_update'),
			("delete_permission_code", 'can_delete'),
			)
	
	def printpdf(self, *args, **kwargs):
		#try:
			self.save()
			from reportlab.lib.pagesizes import A4
			from reportlab.pdfgen import canvas
			from reportlab.lib.units import inch, cm

			top_margin = A4[1] - 1.5 * cm
			bottom_margin = cm
			left_margin = 1.5*cm
			right_margin = A4[0] - 1.5*cm
			frame_width = right_margin - left_margin
			cur_page_no = 1
			total_page_no = 1


			import os
			filename = u'%s/static/media/invoice/%s.pdf' % (os.path.dirname(os.path.dirname(__file__)), self.invoice_id)
			canv = canvas.Canvas(filename, invariant = 1)
			canv.setPageCompression(1)

			canv.setFont('Times-Roman', 25)
			canv.drawString(left_margin, top_margin , self.order.belong_to.name)

			address = Address.objects.filter(company = self.order.belong_to).get (is_default = True)

			canv.setFont('Times-Roman', 8)
			tx = canv.beginText(left_margin, top_margin - 20)
			tx.textLine ( address.first_line )
			if address.second_line:
				tx.textLine ( address.second_line )
			tx.textLine ( u'%s, %s' % (address.city, address.zipcode) )
			tx.textLine ( address.country.name )
			tx.textLine ( u'Telephone: %s' % (self.order.belong_to.phone))
			tx.textLine ( u'Email: %s' % (self.order.belong_to.email))

			canv.drawText(tx)

			canv.line(1.5*cm, A4[1]-5*cm, 1.5*cm, A4[1]-6*cm)
			canv.line(1.5*cm, A4[1]-5*cm, 2.5*cm, A4[1]-5*cm)

			canv.line(9*cm, A4[1]-8.5*cm, 9*cm, A4[1]-7.5*cm)
			canv.line(9*cm, A4[1]-8.5*cm, 8*cm, A4[1]-8.5*cm)

			canv.setFont('Courier', 12)
			tx = canv.beginText(2.3*cm, A4[1]-5.6*cm)
			tx.textLine(self.order.customer.name)
			tx.textLine(self.invoice_address.first_line)
			if self.invoice_address.second_line:
				tx.textLine(self.invoice_address.second_line)
			tx.textLine ( u'%s, %s' % (self.invoice_address.city, self.invoice_address.zipcode) )
			tx.textLine ( self.invoice_address.country.name )						
			canv.drawText(tx)

			canv.setFont('Courier', 8)
			tx = canv.beginText((left_margin+right_margin)/2+2*cm, A4[1]-5.6*cm)
			tx.textLine(u'Invoice No.:     %s' % (self.invoice_id))
			tx.textLine(u'Invoice Date:    %s' % (self.tax_date.strftime('%d %b %Y')))
			tx.textLine('')
			tx.textLine(u'Payment Method:  %s' % (self.payment_method))
			if self.payment_status:
				tx.textLine('Payment Status:  Paid with thanks')
			else:
				tx.textLine('Payment Status:  Unpaid')
				tx.textLine('Term Days:       %s' % (self.term_days))
			tx.textLine('')
			tx.textLine('Order No.:       %s' % (self.order.uuid))
			tx.textLine('Order Status:    %s' % (self.order.status.name))
			canv.drawText(tx)

			canv.drawString(left_margin, A4[1]-11*cm, u'Default Currency: %s' % (self.order.belong_to.default_currency.name))
			canv.line(left_margin,A4[1]-11.2*cm,right_margin,A4[1]-11.2*cm)

			canv.drawString(left_margin, A4[1]-11.5*cm, 'ID')
			canv.drawString(left_margin+4*cm, A4[1]-11.5*cm, 'PRODUCT NAME')
			canv.drawString(left_margin+9*cm, A4[1]-11.5*cm, 'RRP')
			canv.drawString(left_margin+11*cm, A4[1]-11.5*cm, 'DISCOUNT(%)')
			canv.drawString(left_margin+13*cm, A4[1]-11.5*cm, 'QTY')
			canv.drawString(left_margin+14.5*cm, A4[1]-11.5*cm, 'SUBTOTAL')
			canv.drawString(left_margin+17*cm, A4[1]-11.5*cm, 'VAT')

			canv.setLineWidth(0.3)
			canv.line(left_margin,A4[1]-11.7*cm,right_margin,A4[1]-11.7*cm)

			import math
			records = RecordOrder.objects.filter(owner = self.order)

			total_page_no = int(math.floor((records.count()-20)/34)+2)

			idtx = canv.beginText(left_margin, A4[1]-12.2*cm)
			producttx = canv.beginText(left_margin+4*cm, A4[1]-12.2*cm)
			rrptx = canv.beginText(left_margin+9*cm, A4[1]-12.2*cm)
			discounttx = canv.beginText(left_margin+11*cm, A4[1]-12.2*cm)
			quantitytx = canv.beginText(left_margin+13*cm, A4[1]-12.2*cm)
			subtotaltx = canv.beginText(left_margin+14.5*cm, A4[1]-12.2*cm)
			vattx = canv.beginText(left_margin+17*cm, A4[1]-12.2*cm)

			for r in records:
				if r.status.name != 'cancel':
					if r.product.pid:
						idtx.textLine(r.product.pid)
					else:
						idtx.textLine('')
					idtx.textLine('')
					producttx.textLine(r.product.name)
					producttx.textLine('')
					rrptx.textLine(str(r.product.rrp))
					rrptx.textLine('')
					discounttx.textLine(str(r.discount_percentage))
					discounttx.textLine('')
					quantitytx.textLine(str(r.quantity))
					quantitytx.textLine('')
					subtotaltx.textLine(str(r.subtotal()))
					subtotaltx.textLine('')
					vattx.textLine(str(r.subtotal()*self.VAT_rate/100))
					vattx.textLine('')

				y = producttx.getY()
				if y < bottom_margin + 3.5 * cm:
					canv.drawText(idtx)
					canv.drawText(producttx)
					canv.drawText(rrptx)
					canv.drawText(discounttx)
					canv.drawText(quantitytx)
					canv.drawText(subtotaltx)
					canv.drawText(vattx)
					canv.drawString(left_margin, bottom_margin - 0.5*cm, u'Invoice No. %s' % (self.invoice_id))
					canv.drawString(right_margin-50, bottom_margin - 0.5*cm, u'Page %s/%s' % (cur_page_no, total_page_no))
					canv.showPage()

					cur_page_no = cur_page_no + 1
					canv.setFont('Courier', 8)
					canv.drawString(left_margin, bottom_margin - 0.5*cm, u'Invoice No. %s' % (self.invoice_id))
					canv.drawRightString(right_margin, bottom_margin - 0.5*cm, u'Page %s/%s' % (cur_page_no, total_page_no))
					canv.setFont('Courier', 8)

					canv.drawString(left_margin, top_margin, 'ID')
					canv.drawString(left_margin+4*cm, top_margin, 'PRODUCT NAME')
					canv.drawString(left_margin+9*cm, top_margin, 'RRP')
					canv.drawString(left_margin+11*cm, top_margin, 'DISCOUNT(%)')
					canv.drawString(left_margin+13*cm, top_margin, 'QUANTITY')
					canv.drawString(left_margin+14.5*cm, top_margin, 'SUBTOTAL')
					canv.drawString(left_margin+17*cm, top_margin, 'VAT')

					canv.setLineWidth(0.3)
					canv.line(left_margin,top_margin-0.2*cm,right_margin,top_margin-0.2*cm)

					idtx = canv.beginText(left_margin, top_margin - 0.7*cm)
					producttx = canv.beginText(left_margin+4*cm, top_margin - 0.7*cm)
					rrptx = canv.beginText(left_margin+9*cm, top_margin - 0.7*cm)
					discounttx = canv.beginText(left_margin+11*cm, top_margin - 0.7*cm)
					quantitytx = canv.beginText(left_margin+13*cm, top_margin - 0.7*cm)
					subtotaltx = canv.beginText(left_margin+14.5*cm, top_margin - 0.7*cm)
					vattx = canv.beginText(left_margin+17*cm, top_margin - 0.7*cm)

			if producttx:
				canv.drawText(idtx)
				canv.drawText(producttx)
				canv.drawText(rrptx)
				canv.drawText(discounttx)
				canv.drawText(quantitytx)
				canv.drawText(subtotaltx)
				canv.drawText(vattx)

				canv.line(left_margin, producttx.getY() + 0.2*cm, right_margin, producttx.getY() + 0.2*cm)
				canv.drawRightString(right_margin , producttx.getY() - 0.2*cm, u'TOTAL excl VAT:   %.2f' % (self.order.total_price()))
				canv.drawRightString(right_margin , producttx.getY() - 0.7*cm, u'VAT:   %.2f' % (self.order.total_price()*self.VAT_rate/100))
				canv.drawRightString(right_margin , producttx.getY() - 1.2*cm, u'TOTAL:   %.2f' % (self.order.total_price()*(self.VAT_rate+100)/100))

				canv.drawString(left_margin , producttx.getY() - 0.2*cm, u'V.A.T. Registration No.: %s' % (self.order.belong_to.vat_no))
				canv.drawString(left_margin , producttx.getY() - 0.7*cm, u'Company Registration No.: %s' % (self.order.belong_to.registration_no))
				if self.comment:
					canv.line(left_margin,producttx.getY() - 1.6*cm,right_margin,producttx.getY() - 1.6*cm)
					tx = canv.beginText(left_margin , producttx.getY() - 2*cm)
					tx.textLines(self.comment)
					canv.drawText(tx)
				canv.setFont('Courier', 8)
				canv.drawString(left_margin, bottom_margin - 0.5*cm, u'Invoice No. %s' % (self.invoice_id))
				canv.drawRightString(right_margin, bottom_margin - 0.5*cm, u'Page %s/%s' % (cur_page_no, total_page_no))
				canv.setFont('Courier', 8)
				canv.showPage()
			
			canv.save()
			self.pdffile = u'invoice/%s.pdf' % self.invoice_id
			self.save()
		#except:
		#	raise IntegrityError()



	def save(self, *args, **kwargs):
		super(Invoice, self).save(*args, **kwargs)
		role_set = EmployeeRole.objects.filter(belong_to = self.order.belong_to)
		for r in role_set:
			g = Group.objects.get(id = r.id)
			assign_perm('view_permission_code', g, self)
			if r.role =='admin' or r.role =='mgr' or r.role =='sales':
				assign_perm('create_permission_code', g, self)
				assign_perm('update_permission_code', g, self)



