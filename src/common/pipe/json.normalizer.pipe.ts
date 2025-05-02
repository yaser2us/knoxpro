// src/common/pipes/json-normalizer.pipe.ts
import {
    Injectable,
    PipeTransform,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common';

@Injectable()
export class JsonNormalizerPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body' && value?.data?.attributes) {
            const attrs = value.data.attributes;

            const fieldsToNormalize = ['steps', 'metadata', 'definitions'];



            for (const key of fieldsToNormalize) {
                const val = attrs[key];

                console.log('[pipe]', val)
                if (typeof val === 'string') {
                    try {
                        attrs[key] = JSON.parse(val);
                    } catch (err) {
                        throw new BadRequestException(`Invalid JSON string for "${key}"`);
                    }
                }
            }
        }

        return value;
    }
}
