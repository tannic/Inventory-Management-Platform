import logging

from django.contrib.auth.models import User, Permission
from django.contrib.contenttypes.models import ContentType
from tastypie.authorization import DjangoAuthorization, Authorization
from tastypie.exceptions import Unauthorized
 
from guardian.shortcuts import get_objects_for_user
from guardian.core import ObjectPermissionChecker
 
 
logger = logging.getLogger(__name__)
 
 
class GuardianAuthorization(DjangoAuthorization):
 
    # List Checks
    def create_list(self, object_list, bundle):
        #print 'create list'
        obj = object_list.first()   
        contenttype = ContentType.objects.get_for_model(obj)
        perm = Permission.objects.filter(content_type = contenttype).get(codename = u'add_%s' % (contenttype.model))
        objset = set()
        permstring = u'%s.%s' % ('db_tables', perm.codename) 
        for t in object_list:
            if bundle.request.user.has_perm(permstring):
                objset.add(t.pk)
        return object_list.filter(pk__in = objset)
 
    def read_list(self, object_list, bundle):
        obj = object_list.first()
        contenttype = ContentType.objects.get_for_model(obj)
        perm = Permission.objects.filter(content_type = contenttype).get(name = 'can_view')
        permstring = u'%s.%s' % ('db_tables', perm.codename) 
        objset = set()
        for t in object_list:
            if bundle.request.user.has_perm(permstring, t):
                objset.add(t.pk)
        return object_list.filter(pk__in = objset)
 
    def update_list(self, object_list, bundle):
        #print 'testtest1'
        obj = object_list.first()
        contenttype = ContentType.objects.get_for_model(obj)
        perm = Permission.objects.filter(content_type = contenttype).get(name = 'can_update')
        permstring = u'%s.%s' % ('db_tables', perm.codename) 
        objset = set()
        for t in object_list:
            if bundle.request.user.has_perm(permstring, t):
                objset.add(t.pk)
        return object_list.filter(pk__in = objset)
 
    def delete_list(self, object_list, bundle):
        #print 'delete list'
        obj = object_list.first()
        contenttype = ContentType.objects.get_for_model(obj)
        perm = Permission.objects.filter(content_type = contenttype).get(name = 'can_delete')
        permstring = u'%s.%s' % ('db_tables', perm.codename) 
        objset = set()
        for t in object_list:
            if bundle.request.user.has_perm(permstring, t):
                objset.add(t.pk)
        return object_list.filter(pk__in = objset)
 
    # Item Checks
    def create_detail(self, object_list, bundle):
        contenttype = ContentType.objects.get_for_model(bundle.obj)
        perm = Permission.objects.get(codename = u'add_%s' % (contenttype.model))
        permstring = u'%s.%s' % ('db_tables', perm.codename)
        #print bundle.data
        #for p in bundle.request.user.get_all_permissions():
        #    print bundle.request.user.username
        #    print p
        #print 'create'
        return bundle.request.user.has_perm(permstring)
 
    def read_detail(self, object_list, bundle):
        contenttype = ContentType.objects.get_for_model(bundle.obj)
        perm = Permission.objects.filter(content_type = contenttype).get(name = 'can_view')
        permstring = u'%s.%s' % ('db_tables', perm.codename)

        #if not bundle.request.user.has_perm(permstring, bundle.obj):
        #   print 'read reject'
        #    print bundle.request.user
        #    print object_list.first()

        return bundle.request.user.has_perm(permstring, bundle.obj)
 
    def update_detail(self, object_list, bundle):
        #print 'testtest'
        contenttype = ContentType.objects.get_for_model(bundle.obj)
        perm = Permission.objects.filter(content_type = contenttype).get(name = 'can_update')
        permstring = u'%s.%s' % ('db_tables', perm.codename)
        
        return bundle.request.user.has_perm(permstring, bundle.obj)
 
    def delete_detail(self, object_list, bundle):
        contenttype = ContentType.objects.get_for_model(bundle.obj)
        perm = Permission.objects.filter(content_type = contenttype).get(name = 'can_delete')
        permstring = u'%s.%s' % ('db_tables', perm.codename)
        #print 'delete'
        return bundle.request.user.has_perm(permstring, bundle.obj)