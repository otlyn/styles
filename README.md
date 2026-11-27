# @otlyn/styles

Type-safe, variant-driven styling for JavaScript and TypeScript.

The examples build a React button with TypeScript and Tailwind CSS.
`@otlyn/styles` doesn't require any of them: it works in plain JavaScript
with any CSS class names.

## Usage

Pass an array of rules to `styles()`, then call the returned function with
the selector values you want to match.

### Scope styles to selectors

#### Match one value with a string

Use a string when a rule should match one selector value. A rule with no
selectors, like the `rounded` rule below, always applies.

```ts
import { styles } from "@otlyn/styles";

const buttonStyles = styles([
  { className: "rounded" },
  { variant: "default", className: "bg-blue-600" },
  { variant: "secondary", className: "bg-gray-100" },
]);

buttonStyles({ variant: "default" }); // "rounded bg-blue-600"
buttonStyles({ variant: "secondary" }); // "rounded bg-gray-100"
```

#### Match several values with an array

Use an array when a rule should match any listed value for a selector. Here,
`variant` must be `default` or `secondary`, and `disabled` must be `true`.

```ts
import { styles } from "@otlyn/styles";

const buttonStyles = styles([
  {
    variant: ["default", "secondary"],
    disabled: true,
    className: "opacity-50",
  },
]);

buttonStyles({ variant: "default", disabled: true }); // "opacity-50"
buttonStyles({ variant: "secondary", disabled: true }); // "opacity-50"
buttonStyles({ variant: "default", disabled: false }); // ""
```

#### Skip rules with `null`

Pass `null` to skip rules that depend on a selector. Here, `size: null` skips
the padding rule but keeps the unconditional `rounded` class.

```ts
import { styles } from "@otlyn/styles";

const buttonStyles = styles([
  { className: "rounded" },
  { size: "sm", className: "px-2 py-1" },
]);

buttonStyles({ size: "sm" }); // "rounded px-2 py-1"
buttonStyles({ size: null }); // "rounded"
```

### Group classes with an array

`className` can be a single string or an array of strings. Use an array if you
prefer to group related classes, such as spacing and appearance. Both forms
produce the same result.

```ts
import { styles } from "@otlyn/styles";

const buttonStyles = styles([
  { className: ["px-4 py-2", "rounded bg-blue-600"] },
]);

buttonStyles(); // "px-4 py-2 rounded bg-blue-600"
```

### Merge Tailwind classes with `cn`

`styles()` collects matching classes without resolving conflicts. For Tailwind
overrides, install the optional [`cn`](https://www.npmjs.com/package/cn) helper
with `npm install cn`.

In `cn(buttonStyles({ variant, size }), className)`, the caller's `className`
comes last so it wins when Tailwind utilities conflict.

```tsx
import { styles, type StyleProps } from "@otlyn/styles";
import { cn } from "cn";
import type { ComponentProps } from "react";

const buttonStyles = styles([
  { className: "rounded" },
  { variant: "default", className: "bg-blue-600" },
  { variant: "secondary", className: "bg-gray-100" },
  { size: "default", className: "px-4 py-2" },
  { size: "sm", className: "px-2 py-1" },
]);

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ComponentProps<"button"> & StyleProps<typeof buttonStyles>) {
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  );
}
```

For example, `<Button size="sm" className="bg-red-600">Save</Button>` replaces
`bg-blue-600` with `bg-red-600` and keeps the rounding and small-size padding.

## Development

From a local clone, install dependencies and run the checks:

```sh
npm ci
npm run typecheck
npm test
```

## License

[MIT](./LICENSE) © Otlyn Black.
