import 'package:flutter/material.dart';
import 'package:badges/badges.dart' as badges;

class Product {
  final String name;
  final double price;
  final String imageUrl;
  int quantity;

  Product({required this.name, required this.price, required this.imageUrl, this.quantity = 0});
}

class BigBasketGrid extends StatelessWidget {
  final List<Product> products;
  final void Function(Product product) onAdd;
  final void Function(Product product) onRemove;

  const BigBasketGrid({Key? key, required this.products, required this.onAdd, required this.onRemove}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      padding: const EdgeInsets.all(8),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        childAspectRatio: 0.75,
        mainAxisSpacing: 8,
        crossAxisSpacing: 8,
      ),
      itemCount: products.length,
      itemBuilder: (context, index) {
        return _ProductCard(
          product: products[index],
          onAdd: onAdd,
          onRemove: onRemove,
        );
      },
    );
  }
}

class _ProductCard extends StatelessWidget {
  final Product product;
  final void Function(Product product) onAdd;
  final void Function(Product product) onRemove;

  const _ProductCard({Key? key, required this.product, required this.onAdd, required this.onRemove}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
      child: Padding(
        padding: const EdgeInsets.all(8),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  product.imageUrl,
                  fit: BoxFit.cover,
                  width: double.infinity,
                  errorBuilder: (_, __, ___) => const Icon(Icons.broken_image),
                ),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              product.name,
              style: const TextStyle(fontWeight: FontWeight.w600, fontFamily: 'Roboto'),
              maxLines: 2,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              '₹${product.price.toStringAsFixed(2)}',
              style: const TextStyle(fontWeight: FontWeight.bold, fontFamily: 'Roboto'),
            ),
            const SizedBox(height: 4),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                IconButton(
                  icon: const Icon(Icons.remove_circle_outline),
                  onPressed: product.quantity > 0 ? () => onRemove(product) : null,
                ),
                Text('${product.quantity}', style: const TextStyle(fontFamily: 'Roboto')),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline),
                  onPressed: () => onAdd(product),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class CartIconWithBadge extends StatelessWidget {
  final int itemCount;
  final VoidCallback onTap;

  const CartIconWithBadge({Key? key, required this.itemCount, required this.onTap}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return IconButton(
      onPressed: onTap,
      icon: badges.Badge(
        position: badges.BadgePosition.topEnd(top: -4, end: -4),
        badgeContent: Text(
          '$itemCount',
          style: const TextStyle(color: Colors.white, fontSize: 10),
        ),
        child: const Icon(Icons.shopping_cart),
      ),
    );
  }
}

// Add the following meta tag to web/index.html to prevent zoom on reload:
// <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />

