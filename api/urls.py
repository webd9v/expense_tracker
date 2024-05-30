from django.urls import path

from .views import *

app_name = "api"
urlpatterns = [
    path('expenses/<int:expense_id>/', get_expense, name="get_expense"),
    path('expenses/', get_all_expenses, name="get_all_expenses"),
    path('expenses/add/', add_expense, name="add_expense"),
    path('expenses/search/', search_expenses, name="search_expenses"),
    path('login/', login_view, name="login"),
    path('logout/', logout_view, name="logout"),
    path('register/', register, name="register"),
    path('csrf_token/', get_csrf_token, name="token"),
    path('delete_expense/<int:expense_id>/', delete_expense, name="delete_expense"),
    path('categories/', get_all_categories, name="get_all_categories"),
]