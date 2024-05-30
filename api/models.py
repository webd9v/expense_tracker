from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Category(models.Model):
    category_name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
    
    def __str__(self):
        return self.category_name


class Expense(models.Model):
    expense_id = models.AutoField(primary_key=True, verbose_name="Expense ID")
    expense_title = models.CharField(max_length=50, verbose_name="Expense Title", blank=False, null=False)
    expense_description = models.TextField(blank=True, null=True, verbose_name="Expense Description")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="expenses")
    date_created = models.DateField(auto_now_add=True, verbose_name="Date Created")
    date_occured = models.DateField(verbose_name="Date Occurred")
    is_paid = models.BooleanField(default=False, verbose_name="Is Paid")
    due_date = models.DateField(blank=True, null=True, verbose_name="Due Date")
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name="category_expenses", default=None)

    class Meta:
        verbose_name = "Expense"
        verbose_name_plural = "Expenses"

    def __str__(self):
        return self.expense_title