import { 
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../user/user.entity";

export enum TypeTransaction {
    CIUDAD = "CIUDAD",
    COORDENADAS = "COORDENADAS"
}

@Entity({ name: 'transactions' })
export class Transaction {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ type: 'number' })
    user_id: number;

    @Column({
        type: 'enum',
        enum: TypeTransaction,
      })
    transaction_type: string;

    @Column({ type: 'varchar' })
    search_location: string;

    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    created_at: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamptz',
        default: () => 'CURRENT_TIMESTAMP',
    })
    updated_at: Date;

}