import { styles, type StyleProps } from "@otlyn/styles";

const button = styles([
  { className: ["button", "rounded"] },
  { variant: ["primary", "secondary"], className: "colored" },
  { disabled: [true, false], className: "toggleable" },
  { variant: "danger", disabled: true, className: "blocked" },
]);

type ButtonProps = StyleProps<typeof button>;

const selection: ButtonProps = { variant: "secondary", disabled: false };
const classes: string = button(selection);
button();
button({ variant: "danger", disabled: null });
button({ variant: null });

// @ts-expect-error Only values declared for this selector are accepted.
button({ variant: "success" });
// @ts-expect-error Boolean selectors do not accept string values.
button({ disabled: "false" });
// @ts-expect-error Selector arrays describe allowed values, not call-site inputs.
button({ variant: ["primary"] });
// @ts-expect-error Unknown selectors are rejected.
button({ size: "small" });
// @ts-expect-error Rule selectors do not accept numbers.
styles([{ priority: 1, className: "high" }]);
// @ts-expect-error Rule classes must be strings or arrays of strings.
styles([{ className: 1 }]);
