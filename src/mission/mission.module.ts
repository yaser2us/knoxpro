import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionDefinition } from './entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            MissionDefinition
        ])
    ],
    controllers: [],
    providers: [],
    exports: []
})
export class MissionModule { }
