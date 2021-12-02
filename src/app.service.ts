import { Injectable } from '@nestjs/common';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY,{apiVersion:"2020-08-27",typescript:true})

@Injectable()
export class AppService {
  async createCharge(amount:number,currency:string,source:string,description:string) {
    return await stripe.charges.create({
      amount,
      description,
      source,
      currency
    })
  }
}
