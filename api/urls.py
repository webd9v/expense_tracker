from django.urls import path

from .views import *

app_name = "api"
urlpatterns = [
    path('', index, name='index'),
    path('expenses/<int:expense_id>/', get_expense, name="get_expense"),
    path('expenses/', get_all_expenses, name="get_all_expenses"),
    path('expenses/add/', add_expense, name="add_expense"),
    path('login/', login_view, name="login"),
    path('logout/', logout_view, name="logout"),
    path('register/', register, name="register")
]