import { Module } from "@nestjs/common";
import {RabbitMQModule} from "@golevelup/nestjs-rabbitmq";
import { ORDERS_EXCHANGE } from "./util/constaints";

@Module({
imports:[RabbitMQModule.forRoot(RabbitMQModule,{
    exchanges:[
        {name:ORDERS_EXCHANGE,type:"direct"}
    ],
    uri:process.env.EVENTBUS_URI,
    connectionInitOptions:{wait:false},})],
exports:[RabbitMQModule],
})
export class SharedModule{}
