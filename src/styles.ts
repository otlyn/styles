type RuleClasses = string | readonly string[];

type Rule = Readonly<{ className: RuleClasses }>;

type SelectorKey<Item> = Item extends unknown
  ? Exclude<keyof Item, "className">
  : never;

type SelectorValue<Item, Key extends PropertyKey> =
  Item extends Record<Key, infer Value>
    ? Value extends readonly (infer Element)[]
      ? Element
      : Value
    : never;

type Selection<Item> = {
  readonly [Key in SelectorKey<Item>]?: SelectorValue<Item, Key> | null;
};

type StyleProps<Style extends (...args: never[]) => unknown> = NonNullable<
  Parameters<Style>[0]
>;

type ValidRules<Rules extends readonly Rule[]> = {
  [Index in keyof Rules]: Rules[Index] extends {
    readonly [Key in SelectorKey<Rules[Index]>]?:
      | string
      | boolean
      | readonly (string | boolean)[]
      | undefined;
  }
    ? Rules[Index]
    : never;
};

function styles<const Rules extends readonly Rule[]>(
  rules: Rules & ValidRules<Rules>,
) {
  type Props = Selection<Rules[number]>;

  const prepared = rules.map(({ className, ...selectors }) => {
    const conditions = Object.entries(selectors).map(
      ([key, value]: [string, unknown]) =>
        [key, Array.isArray(value) ? [...value] : [value]] as const,
    );

    return {
      className:
        typeof className === "string"
          ? className
          : className.filter(Boolean).join(" "),
      conditions,
    };
  });

  function resolve(selection: Props = {}): string {
    const values: Readonly<Record<string, unknown>> = selection;
    return prepared
      .filter(({ conditions }) =>
        conditions.every(([key, options]) => options.includes(values[key])),
      )
      .map(({ className }) => className)
      .filter(Boolean)
      .join(" ");
  }

  return resolve;
}

export { styles };
export type { StyleProps };
