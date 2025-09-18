package com.yourcompany.ecommerce.service;

import com.yourcompany.ecommerce.model.Product;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    private List<Product> products = new ArrayList<>();

    public List<Product> getAllProducts() { return products; }
    public void addProduct(Product p) { products.add(p); }
}
