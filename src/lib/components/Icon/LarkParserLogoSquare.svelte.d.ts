import type { Component } from 'svelte';
import type { IconComponentProps } from './shared.js';

/**
 *
 * @example
 * ```svelte
 * <LarkParserLogo color="white" weight="fill" size="20px" mirrored={false} />
 * ```
 *
 * @prop {string} color
 * @prop {number | string} size
 * @prop {"bold" | "duotone" | "fill" | "light" | "thin" | "regular"} weight
 * @prop {boolean} mirrored
 */
declare const LarkParserLogo: Component<IconComponentProps, {}, ''>;
type LarkParserLogo = ReturnType<typeof LarkParserLogo>;
export default LarkParserLogo;
