import type { Component } from 'svelte';
import type { IconComponentProps } from './shared.js';

/**
 *
 * @example
 * ```svelte
 * <LarkParserLogoRaw color="white" weight="fill" size="20px" mirrored={false} />
 * ```
 *
 * @prop {string} color
 * @prop {number | string} size
 * @prop {"bold" | "duotone" | "fill" | "light" | "thin" | "regular"} weight
 * @prop {boolean} mirrored
 */
declare const LarkParserLogoRaw: Component<IconComponentProps, {}, ''>;
type LarkParserLogoRaw = ReturnType<typeof LarkParserLogoRaw>;
export default LarkParserLogoRaw;
