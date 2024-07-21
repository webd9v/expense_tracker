from rest_framework import serializers
from .models import Expense, Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class CategoryNameField(serializers.RelatedField):
    def to_representation(self, value):
        return value.category_name


class ExpenseSerializer(serializers.ModelSerializer):
    category = CategoryNameField(queryset=Category.objects.all())

    class Meta:
        model = Expense
        fields = "__all__"