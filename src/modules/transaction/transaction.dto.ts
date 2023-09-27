import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { TypeTransaction } from "src/models/transaction/transaction.entity";

export class CreateTransactionDto {

    @ApiProperty()
    @IsNotEmpty()
    user_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(TypeTransaction)
    transaction_type: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    search_location: string;

}
