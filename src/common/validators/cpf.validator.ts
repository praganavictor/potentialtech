import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export const IsCPF = (validationOptions?: ValidationOptions) => {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      name: 'isCPF',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string' || value.length !== 11) {
            return false;
          }

          if (/^(\d)\1{10}$/.test(value)) {
            return false;
          }

          const digits = value.split('').map(Number);

          const calcDigit = (slice: number) => {
            const sum = digits.slice(0, slice).reduce((acc, d, i) => acc + d * (slice + 1 - i), 0);
            const remainder = sum % 11;
            return remainder < 2 ? 0 : 11 - remainder;
          };

          return digits[9] === calcDigit(9) && digits[10] === calcDigit(10);
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid CPF format';
        },
      },
    });
  };
};
