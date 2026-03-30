export class Address {
  constructor(
    public readonly street: string,
    public readonly number: string,
    public readonly complement: string | null,
    public readonly neighborhood: string,
    public readonly city: string,
    public readonly state: string,
    public readonly zipCode: string,
  ) {}

  static create(props: {
    street: string;
    number: string;
    complement: string | null;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  }): Address {
    return new Address(
      props.street,
      props.number,
      props.complement,
      props.neighborhood,
      props.city,
      props.state,
      props.zipCode,
    );
  }

  formatted(): string {
    const comp = this.complement ? `, ${this.complement}` : '';
    const zip = `${this.zipCode.slice(0, 5)}-${this.zipCode.slice(5)}`;
    return `${this.street}, ${this.number}${comp} - ${this.neighborhood}, ${this.city}/${this.state} - ${zip}`;
  }
}
