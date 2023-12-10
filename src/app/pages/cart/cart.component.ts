import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { loadStripe } from "@stripe/stripe-js";
import { Cart, CartItem } from "src/app/models/cart.model";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
})
export class CartComponent implements OnInit {
  cart: Cart = {
    items: [
      /* {
        product: "https://via.placeholder.com/150",
        name: "Snickers",
        price: 150,
        quantity: 1,
        id: 1,
      },
      {
        product: "https://via.placeholder.com/150",
        name: "Shoe",
        price: 200,
        quantity: 2,
        id: 2,
      }, */
    ],
  };
  dataSource: Array<CartItem> = [];
  displayedColumns: Array<string> = [
    "product",
    "name",
    "price",
    "quantity",
    "total",
    "action",
  ];
  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.dataSource = this.cart.items;
    this.cartService.cart.subscribe((_cart: Cart) => {
      this.cart = _cart;
      this.dataSource = this.cart.items;
    });
  }

  //Get total price of all items in cart
  getTotal(items: Array<CartItem>): number {
    return this.cartService.getTotal(items);
  }

  //Clear all items from the cart
  onClearCart(): void {
    this.cartService.clearCart();
  }

  //Remove a specific item from cart
  onRemoveFromCart(item: CartItem): void {
    this.cartService.removeFromCart(item);
  }

  //Increase 1 quantity of the item
  onAddQuantity(item: CartItem): void {
    this.cartService.addToCart(item);
  }

  //Descrease 1 quantity of the item
  onRemoveQuantity(item: CartItem): void {
    this.cartService.removeQuantity(item);
  }

  //Checkout
  onCheckout(): void {
    this.http
      .post("http://127.0.0.1:4242/checkout", {
        items: this.cart.items,
      })
      .subscribe(async (res: any) => {
        let stripe = await loadStripe(
          "pk_test_51KtK3EIwiS6Cqg3Wor8A7SOv1qGPEXL6HKZGmvjzvlRhN1igIfhCgbr5al2pMqf9oUfuWaepQxRjFfNOByl9kfvN00So3QOUeD"
        );
        stripe?.redirectToCheckout({
          sessionId: res.id
        });
      });
  }
}
