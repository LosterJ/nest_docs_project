import { IsInt, IsString } from "class-validator";

export class CreateCatDto {
    @IsString()
    name: string;

    @IsInt()
    age: number;

    @IsString()
    breed: string;
}


/* Object schema valid

    import { z } from "zod";
    export const createCatSchema = z
        .object({
            name: z.string(),
            age: z.number(),
            breed: z.string(),
        })
        .required();
    export type CreateCatDto = z.infer<typeof createCatSchema>;
 */

/* Not valid just list
    export class CreateCatDto {
        name: string;
        age: number;
        breed: string;
    }
*/

/*
A DTO is an object that defines how the data will be sent over the network.
    Should use classes but not TypeScript interfaces (bcz:
        - JS ES6 standard -> they are preserved as real entities in the compiled JS;
        - TS interfaces are removed during the transpilation, Nest can't refer to them at runtime.)
    This is important bcz features such as Pipes enable additional possibilities when they have access to the metatype of the variable at runtime.


Our ValidationPipe can filter out properties that should not be received by the method handler. 
In this case, we can whitelist the acceptable properties, and any property not included in the whitelist is automatically stripped from the resulting object. 
In the CreateCatDto example, our whitelist is the name, age, and breed properties. 

*/