import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MONGO_DB_NAME, USER_COLLECTION } from './constants';
import { User, UserSchema } from './schemas/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/soldcom', { connectionName: MONGO_DB_NAME }),
    MongooseModule.forFeature(
      [
        {
          name: User.name,
          collection: USER_COLLECTION,
          schema: UserSchema,
        },
      ],
      MONGO_DB_NAME,
    ),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
