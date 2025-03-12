import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class UUIDValidationPipe implements PipeTransform {
    transform(value: any) {
        if (typeof value === 'string') {
            console.log(value, '[value] pipe ;)')
            return value; // If it's already a valid UUID, return as is.
        }

        throw new BadRequestException(`Invalid UUID: ${value}`);
    }
}
