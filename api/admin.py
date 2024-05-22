from django.contrib import admin
from .models import User, Expense

class ExpenseAdmin(admin.ModelAdmin):
    list_display = (
        'expense_id',
        'expense_title',
        'expense_description',
        'user',
        'date_created',
        'date_occured',
        'is_paid',
        'due_date'
    )
    search_fields = ('expense_title', 'user__username')  # Adds a search box to search by title or user
    list_filter = ('is_paid', 'date_created', 'date_occured')  # Adds filters in the sidebar
    ordering = ('-date_created',)  # Orders by date created in descending order

class UserAdmin(admin.ModelAdmin):
    list_display=("id", "username", "email")

admin.site.register(User, UserAdmin)
admin.site.register(Expense, ExpenseAdmin)