import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Cart, CartItem } from "../models/cart.model";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cart = new BehaviorSubject<Cart>({ items: [] });

  constructor(private _snackBar: MatSnackBar) {}

  addToCart(item: CartItem): void {
    const items = [...this.cart.value.items];
    const itemsInCart = items.find((_item) => _item.id === item.id);

    if (itemsInCart) {
      itemsInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items: items });
    this._snackBar.open(`1 ${item.name} added to cart!`, "Ok", { duration: 3000 });
  }

  getTotal(items: Array<CartItem>): number {
    return items
      .map((item) => item.price * item.quantity)
      .reduce((prev, current) => prev + current, 0);
  }

  clearCart(): void {
    this.cart.next({ items: [] });
    this._snackBar.open("Cart is cleared!", "Ok", { duration: 3000 });
  }

  //Remove a specific item from cart.
  removeFromCart(item: CartItem, update = true): Array<CartItem> {
    let productName = item.name;
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );

    if (update) {
      this.cart.next({ items: filteredItems });
      this._snackBar.open(`${productName} is removed from cart!`, "Ok", {
        duration: 3000,
      });
    }
    return filteredItems;
  }

  //Descrease 1 quantity of the item
  removeQuantity(item: CartItem): void {
    let itemForRemoval: CartItem | undefined;    
    let filteredItems = this.cart.value.items.map((_item) => {
      if (_item.id === item.id) {
        _item.quantity -= 1;        

        if (_item.quantity === 0) {
          itemForRemoval = _item;
        }
      }
      return _item;
    });
    if (itemForRemoval) {
      filteredItems = this.removeFromCart(itemForRemoval, false);
    }
    this.cart.next({ items: filteredItems });
    this._snackBar.open(`1 ${item.name} removed from cart!`, "Ok", { duration: 3000 });
  }
}
