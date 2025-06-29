import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockedFunction } from 'vitest';
import { clickOutside } from '@/lib/utils/ClickOutside';

describe('ClickOutside utils', () => {
  let mockElement: HTMLElement;
  let clickOutsideAction: ReturnType<typeof clickOutside>;

  beforeEach(() => {
    // Create a mock DOM element
    mockElement = document.createElement('div');
    mockElement.contains = vi.fn();
    mockElement.dispatchEvent = vi.fn();

    // Mock document event listeners
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    if (clickOutsideAction) {
      clickOutsideAction.destroy();
    }
  });

  describe('clickOutside action', () => {
    it('should add event listener on initialization', () => {
      clickOutsideAction = clickOutside(mockElement);

      expect(document.addEventListener).toHaveBeenCalledWith('click', expect.any(Function), true);
    });

    it('should remove event listener on destroy', () => {
      clickOutsideAction = clickOutside(mockElement);
      clickOutsideAction.destroy();

      expect(document.removeEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        true
      );
    });

    it('should dispatch clickoutside event when clicking outside', () => {
      const containsMock = mockElement.contains as ReturnType<typeof vi.fn>;
      containsMock.mockReturnValue(false);

      clickOutsideAction = clickOutside(mockElement);

      // Get the event handler that was registered
      const addEventListenerMock = document.addEventListener as ReturnType<typeof vi.fn>;
      const eventHandler = addEventListenerMock.mock.calls[0][1];

      // Simulate a click event outside the element
      const mockEvent = {
        target: document.createElement('div'),
        defaultPrevented: false
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'clickoutside',
          detail: mockElement
        })
      );
    });

    it('should not dispatch event when clicking inside element', () => {
      (mockElement.contains as unknown as MockedFunction<HTMLElement['contains']>).mockReturnValue(
        true
      );

      clickOutsideAction = clickOutside(mockElement);

      const eventHandler = (
        document.addEventListener as unknown as MockedFunction<typeof document.addEventListener>
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      const mockEvent = {
        target: mockElement,
        defaultPrevented: false
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockElement.dispatchEvent).not.toHaveBeenCalled();
    });

    it('should not dispatch event when default is prevented', () => {
      (mockElement.contains as unknown as MockedFunction<HTMLElement['contains']>).mockReturnValue(
        false
      );

      clickOutsideAction = clickOutside(mockElement);

      const eventHandler = (
        document.addEventListener as unknown as MockedFunction<typeof document.addEventListener>
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      const mockEvent = {
        target: document.createElement('div'),
        defaultPrevented: true
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockElement.dispatchEvent).not.toHaveBeenCalled();
    });

    it('should handle null target', () => {
      (mockElement.contains as unknown as MockedFunction<HTMLElement['contains']>).mockReturnValue(
        false
      );

      clickOutsideAction = clickOutside(mockElement);

      const eventHandler = (
        document.addEventListener as unknown as MockedFunction<typeof document.addEventListener>
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      const mockEvent = {
        target: null,
        defaultPrevented: false
      } as unknown as MouseEvent;

      // Should not throw an error
      expect(() => eventHandler(mockEvent)).not.toThrow();
      expect(mockElement.dispatchEvent).toHaveBeenCalled();
    });

    it('should handle element being null', () => {
      const nullElement = null as unknown as HTMLElement;

      clickOutsideAction = clickOutside(nullElement);

      const eventHandler = (
        document.addEventListener as unknown as MockedFunction<typeof document.addEventListener>
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      const mockEvent = {
        target: document.createElement('div'),
        defaultPrevented: false
      } as unknown as MouseEvent;

      // Should not throw an error when element is null
      expect(() => eventHandler(mockEvent)).not.toThrow();
    });

    it('should create custom event with correct properties', () => {
      (mockElement.contains as unknown as MockedFunction<HTMLElement['contains']>).mockReturnValue(
        false
      );

      clickOutsideAction = clickOutside(mockElement);

      const eventHandler = (
        document.addEventListener as unknown as MockedFunction<typeof document.addEventListener>
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      const mockEvent = {
        target: document.createElement('div'),
        defaultPrevented: false
      } as unknown as MouseEvent;

      eventHandler(mockEvent);

      expect(mockElement.dispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'clickoutside',
          detail: mockElement
        })
      );

      // Verify it's a CustomEvent
      const dispatchedEvent = (
        mockElement.dispatchEvent as unknown as MockedFunction<typeof mockElement.dispatchEvent>
      ).mock.calls[0][0];
      expect(dispatchedEvent.constructor.name).toBe('CustomEvent');
    });

    it('should use capture phase for event listening', () => {
      clickOutsideAction = clickOutside(mockElement);

      expect(document.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function),
        true // capture phase
      );
    });

    it('should remove the same handler that was added', () => {
      clickOutsideAction = clickOutside(mockElement);

      const addedHandler = (
        document.addEventListener as unknown as MockedFunction<typeof document.addEventListener>
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      clickOutsideAction.destroy();

      const removedHandler = (
        document.removeEventListener as unknown as MockedFunction<
          typeof document.removeEventListener
        >
      ).mock.calls[0][1] as (event: MouseEvent) => void;

      expect(addedHandler).toBe(removedHandler);
    });
  });
});
