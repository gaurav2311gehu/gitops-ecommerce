package com.yourcompany.ecommerce.controller;

import com.yourcompany.ecommerce.model.Product;
import com.yourcompany.ecommerce.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public List<Product> getProducts() { return service.getAllProducts(); }

    @PostMapping
    public void addProduct(@RequestBody Product product) { service.addProduct(product); }
}
