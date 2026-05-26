"use client";

import * as React from "react";
import { Pipette } from "lucide-react";
import { motion } from "motion/react";

import { Button } from "./button";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type ColorFormat = "hex" | "rgb" | "hsl";

type ParsedColor = {
  r: number;
  g: number;
  b: number;
  a: number;
};

type ColorPickerContextValue = {
  parsed: ParsedColor;
  value: string;
  format: ColorFormat;
  setFormat: (format: ColorFormat) => void;
  onValueChange: (value: string) => void;
};

const ColorPickerContext = React.createContext<ColorPickerContextValue | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function rgbToHex(r: number, g: number, b: number) {
  return `#${[r, g, b]
    .map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;
}

function rgbaToHex8(r: number, g: number, b: number, a: number) {
  return `${rgbToHex(r, g, b)}${clamp(Math.round(a * 255), 0, 255)
    .toString(16)
    .padStart(2, "0")}`;
}

function rgbToHsl(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
  }

  return {
    h: Math.round((h * 60 + 360) % 360),
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  };
}

function rgbToHsv(r: number, g: number, b: number) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;

  if (delta !== 0) {
    switch (max) {
      case rn:
        h = ((gn - bn) / delta) % 6;
        break;
      case gn:
        h = (bn - rn) / delta + 2;
        break;
      default:
        h = (rn - gn) / delta + 4;
        break;
    }
  }

  const s = max === 0 ? 0 : delta / max;

  return {
    h: Math.round((h * 60 + 360) % 360),
    s: Math.round(s * 1000) / 10,
    v: Math.round(max * 1000) / 10,
  };
}

function hsvToRgb(h: number, s: number, v: number) {
  const saturation = clamp(s, 0, 100) / 100;
  const value = clamp(v, 0, 100) / 100;
  const chroma = value * saturation;
  const segment = ((clamp(h, 0, 360) % 360) / 60) % 6;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = value - chroma;

  let r = 0;
  let g = 0;
  let b = 0;

  if (segment >= 0 && segment < 1) {
    r = chroma;
    g = x;
  } else if (segment < 2) {
    r = x;
    g = chroma;
  } else if (segment < 3) {
    g = chroma;
    b = x;
  } else if (segment < 4) {
    g = x;
    b = chroma;
  } else if (segment < 5) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return {
    r: Math.round((r + match) * 255),
    g: Math.round((g + match) * 255),
    b: Math.round((b + match) * 255),
  };
}

function hslToRgb(h: number, s: number, l: number) {
  const hue = ((clamp(h, 0, 360) % 360) + 360) % 360;
  const saturation = clamp(s, 0, 100) / 100;
  const lightness = clamp(l, 0, 100) / 100;
  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const segment = (hue / 60) % 6;
  const x = chroma * (1 - Math.abs((segment % 2) - 1));
  const match = lightness - chroma / 2;

  let r = 0;
  let g = 0;
  let b = 0;

  if (segment >= 0 && segment < 1) {
    r = chroma;
    g = x;
  } else if (segment < 2) {
    r = x;
    g = chroma;
  } else if (segment < 3) {
    g = chroma;
    b = x;
  } else if (segment < 4) {
    g = x;
    b = chroma;
  } else if (segment < 5) {
    r = x;
    b = chroma;
  } else {
    r = chroma;
    b = x;
  }

  return {
    r: Math.round((r + match) * 255),
    g: Math.round((g + match) * 255),
    b: Math.round((b + match) * 255),
  };
}

function cssColorToRgba(value: string): ParsedColor | null {
  if (typeof document === "undefined") return null;

  const probe = document.createElement("span");
  probe.style.color = value;
  if (!probe.style.color) return null;

  probe.style.position = "fixed";
  probe.style.left = "-9999px";
  probe.style.top = "-9999px";
  document.body.appendChild(probe);
  const computed = getComputedStyle(probe).color;
  probe.remove();

  const match = computed.match(/^rgba?\((.+)\)$/i);
  if (!match) return null;

  const parts = match[1].split(/[,/ ]+/).filter(Boolean);
  if (parts.length < 3) return null;

  return {
    r: Number.parseFloat(parts[0]),
    g: Number.parseFloat(parts[1]),
    b: Number.parseFloat(parts[2]),
    a: parts.length > 3 ? clamp(Number.parseFloat(parts[3]), 0, 1) : 1,
  };
}

function parseColor(value: string): ParsedColor {
  return cssColorToRgba(value) ?? { r: 0, g: 0, b: 0, a: 1 };
}

function colorToOutput(value: ParsedColor) {
  return value.a < 1 ? `rgba(${value.r}, ${value.g}, ${value.b}, ${Math.round(value.a * 100) / 100})` : rgbToHex(value.r, value.g, value.b);
}

function formatColor(parsed: ParsedColor, format: ColorFormat) {
  if (format === "hex") {
    return parsed.a < 1 ? rgbaToHex8(parsed.r, parsed.g, parsed.b, parsed.a) : rgbToHex(parsed.r, parsed.g, parsed.b);
  }

  if (format === "rgb") {
    return parsed.a < 1
      ? `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${Math.round(parsed.a * 100) / 100})`
      : `rgb(${parsed.r}, ${parsed.g}, ${parsed.b})`;
  }

  const { h, s, l } = rgbToHsl(parsed.r, parsed.g, parsed.b);
  return parsed.a < 1
    ? `hsla(${h}, ${s}%, ${l}%, ${Math.round(parsed.a * 100) / 100})`
    : `hsl(${h}, ${s}%, ${l}%)`;
}

function useColorPickerContext() {
  const context = React.useContext(ColorPickerContext);

  if (!context) {
    throw new Error("ColorPicker subcomponents must be used inside <ColorPicker>.");
  }

  return context;
}

type ColorPickerProps = {
  value: string;
  onValueChange: (value: string) => void;
  defaultFormat?: ColorFormat;
  children: React.ReactNode;
};

function ColorPicker({ value, onValueChange, defaultFormat = "hex", children }: ColorPickerProps) {
  const parsed = React.useMemo(() => parseColor(value), [value]);
  const [format, setFormat] = React.useState<ColorFormat>(defaultFormat);

  React.useEffect(() => {
    setFormat(defaultFormat);
  }, [defaultFormat]);

  const context = React.useMemo(
    () => ({ parsed, value, format, setFormat, onValueChange }),
    [format, onValueChange, parsed, value],
  );

  return (
    <ColorPickerContext.Provider value={context}>
      <Popover>{children}</Popover>
    </ColorPickerContext.Provider>
  );
}

function ColorPickerTrigger({ ...props }: React.ComponentProps<typeof PopoverTrigger>) {
  return <PopoverTrigger data-slot="color-picker-trigger" {...props} />;
}

function ColorPickerContent({ className, align = "start", sideOffset = 8, ...props }: React.ComponentProps<typeof PopoverContent>) {
  return (
    <PopoverContent
      data-slot="color-picker-content"
      align={align}
      sideOffset={sideOffset}
      className={cn("w-64 rounded-xl border border-wn-divider bg-popover/95 backdrop-blur-sm p-3 shadow-xl z-50 space-y-3", className)}
      {...props}
    />
  );
}

function ColorPickerSwatch({ className, ...props }: React.ComponentProps<"span">) {
  const { parsed, value } = useColorPickerContext();

  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md border border-wn-divider shadow-sm",
        className,
      )}
      style={{
        backgroundColor: value,
        backgroundImage:
          parsed.a < 1
            ? "linear-gradient(45deg, rgba(255,255,255,.55) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.55) 50%, rgba(255,255,255,.55) 75%, transparent 75%, transparent)"
            : undefined,
        backgroundSize: parsed.a < 1 ? "8px 8px" : undefined,
      }}
      {...props}
    />
  );
}

function ColorPickerArea({ className, ...props }: React.ComponentProps<"div">) {
  const { parsed, onValueChange } = useColorPickerContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const hsv = React.useMemo(() => rgbToHsv(parsed.r, parsed.g, parsed.b), [parsed.b, parsed.g, parsed.r]);

  const updateFromPoint = React.useCallback(
    (clientX: number, clientY: number) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const saturation = clamp(((clientX - rect.left) / rect.width) * 100, 0, 100);
      const value = clamp((1 - (clientY - rect.top) / rect.height) * 100, 0, 100);
      const rgb = hsvToRgb(hsv.h, saturation, value);
      onValueChange(colorToOutput({ ...rgb, a: parsed.a }));
    },
    [hsv.h, onValueChange, parsed.a],
  );

  React.useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => updateFromPoint(event.clientX, event.clientY);
    const handlePointerUp = () => setDragging(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, updateFromPoint]);

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "relative aspect-square overflow-hidden rounded-lg border border-wn-divider bg-wn-control-bg shadow-sm",
        className,
      )}
      style={{
        backgroundImage: [
          "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0))",
          `linear-gradient(to right, rgba(255,255,255,1), hsl(${hsv.h} 100% 50%))`,
        ].join(", "),
        ...props.style,
      }}
      onPointerDown={(event) => {
        event.preventDefault();
        setDragging(true);
        updateFromPoint(event.clientX, event.clientY);
      }}
    >
      <span
        className="pointer-events-none absolute size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.28)]"
        style={{
          left: `${hsv.s}%`,
          top: `${100 - hsv.v}%`,
          backgroundColor: colorToOutput({ ...parsed }),
        }}
      />
    </div>
  );
}

function ColorPickerHueSlider({ className, ...props }: React.ComponentProps<"div">) {
  const { parsed, onValueChange } = useColorPickerContext();
  const ref = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const hsv = React.useMemo(() => rgbToHsv(parsed.r, parsed.g, parsed.b), [parsed.b, parsed.g, parsed.r]);

  const updateFromPoint = React.useCallback(
    (clientX: number) => {
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
      const nextHue = pct * 360;
      const rgb = hsvToRgb(nextHue, hsv.s, hsv.v);
      onValueChange(colorToOutput({ ...rgb, a: parsed.a }));
    },
    [hsv.s, hsv.v, onValueChange, parsed.a],
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => updateFromPoint(e.clientX);
    const handlePointerUp = () => setIsDragging(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp, { once: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, updateFromPoint]);

  const pct = (hsv.h / 360) * 100;
  const isActive = isDragging || isHovering;
  const spring = { type: "spring", duration: 0.25, bounce: 0.1 } as const;

  return (
    <div
      {...props}
      ref={ref}
      className={cn(
        "relative h-7 w-full overflow-hidden rounded-md border border-wn-divider cursor-ew-resize select-none touch-none",
        className
      )}
      style={{
        backgroundImage: "linear-gradient(to right,#ff0000_0%,#ffff00_16.67%,#00ff00_33.33%,#00ffff_50%,#0000ff_66.67%,#ff00ff_83.33%,#ff0000_100%)",
        ...props.style
      }}
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
        updateFromPoint(e.clientX);
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-[11px] font-medium text-white mix-blend-difference whitespace-nowrap leading-none"
        style={{ left: 8, zIndex: 4 }}
      >
        Hue
      </span>
      <span
        className="pointer-events-none absolute top-1/2 -translate-y-1/2 font-mono text-[10px] font-medium text-white mix-blend-difference"
        style={{ right: 6, zIndex: 4 }}
      >
        {Math.round(hsv.h)}°
      </span>
      <div
        className="pointer-events-none absolute top-1/2"
        style={{
          left: `${pct}%`,
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 3,
        }}
      >
        <motion.div
          animate={{
            opacity: isActive ? 1.0 : 0.5,
            scaleX: isActive ? 1 : 0.75,
            scaleY: isActive ? 1 : 0.75,
          }}
          transition={spring}
          className="bg-white rounded-full shadow-[0_0_2px_rgba(0,0,0,0.5)] border border-black/10"
          style={{ width: 2, height: 18 }}
        />
      </div>
    </div>
  );
}

function ColorPickerAlphaSlider({ className, ...props }: React.ComponentProps<"input">) {
  const { parsed, onValueChange } = useColorPickerContext();

  return (
    <input
      aria-label="Alpha"
      type="range"
      min={0}
      max={100}
      step={1}
      value={Math.round(parsed.a * 100)}
      onChange={(event) => {
        const nextAlpha = Number.parseFloat(event.target.value) / 100;
        onValueChange(nextAlpha < 1 ? `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, ${Math.round(nextAlpha * 100) / 100})` : rgbToHex(parsed.r, parsed.g, parsed.b));
      }}
      className={cn(
        "h-2 w-full cursor-pointer appearance-none rounded-full outline-none",
        "bg-[linear-gradient(to_right,rgba(255,255,255,0),rgba(255,255,255,1))]",
        className,
      )}
      {...props}
    />
  );
}

function ColorPickerInput({ className, ...props }: React.ComponentProps<typeof Input>) {
  const { parsed, format, onValueChange } = useColorPickerContext();
  const [draft, setDraft] = React.useState(() => formatColor(parsed, format));

  React.useEffect(() => {
    setDraft(formatColor(parsed, format));
  }, [format, parsed]);

  const commitValue = React.useCallback(
    (nextValue: string) => {
      const parsedValue = cssColorToRgba(nextValue);
      if (parsedValue) {
        onValueChange(colorToOutput(parsedValue));
        setDraft(formatColor(parsedValue, format));
        return;
      }

      setDraft(formatColor(parsed, format));
    },
    [format, onValueChange, parsed],
  );

  return (
    <Input
      value={draft}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={() => commitValue(draft)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commitValue(draft);
        }
      }}
      className={cn("h-8 font-mono text-[11px] tabular-nums", className)}
      {...props}
    />
  );
}

function ColorPickerFormatSelect({ className, ...props }: React.ComponentProps<"select">) {
  const { format, setFormat } = useColorPickerContext();

  return (
    <select
      aria-label="Format"
      value={format}
      onChange={(event) => setFormat(event.target.value as ColorFormat)}
      className={cn(
        "h-8 rounded-md border border-wn-divider bg-wn-control-bg px-2 text-[11px] text-foreground outline-none transition-colors hover:bg-wn-control-hover focus:border-wn-accent",
        className,
      )}
      {...props}
    >
      <option value="hex">Hex</option>
      <option value="rgb">RGB</option>
      <option value="hsl">HSL</option>
    </select>
  );
}

function ColorPickerEyeDropper({ className, ...props }: React.ComponentProps<typeof Button>) {
  const { onValueChange } = useColorPickerContext();
  const supported = typeof window !== "undefined" && "EyeDropper" in window;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={!supported}
      aria-label="Pick a color from the screen"
      className={cn("size-8 shrink-0 border-wn-divider bg-wn-control-bg text-foreground shadow-none hover:bg-wn-control-hover", className)}
      onClick={async () => {
        if (!supported) return;

        try {
          const EyeDropperCtor = (window as Window & { EyeDropper?: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
          if (!EyeDropperCtor) return;

          const eyeDropper = new EyeDropperCtor();
          const result = await eyeDropper.open();
          if (result?.sRGBHex) {
            const parsed = cssColorToRgba(result.sRGBHex);
            if (parsed) {
              onValueChange(colorToOutput(parsed));
            }
          }
        } catch {
          // The user cancelled the picker.
        }
      }}
      {...props}
    >
      <Pipette className="size-3.5" />
    </Button>
  );
}

export {
  ColorPicker,
  ColorPickerArea,
  ColorPickerAlphaSlider,
  ColorPickerContent,
  ColorPickerEyeDropper,
  ColorPickerFormatSelect,
  ColorPickerHueSlider,
  ColorPickerInput,
  ColorPickerSwatch,
  ColorPickerTrigger,
};
