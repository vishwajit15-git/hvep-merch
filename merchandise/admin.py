from django.contrib import admin
from .models import Product, Category, Profile
admin.site.site_url = "/merch/"

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ('name',)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock', 'is_active')
    list_filter = ('is_active', 'category')
    search_fields = ('name',)
    list_editable = ('price', 'stock')

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'full_name', 'mobile', 'get_email']
    search_fields = ['user__username', 'user__email', 'full_name', 'mobile']
    list_filter = ['user__date_joined']
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'

