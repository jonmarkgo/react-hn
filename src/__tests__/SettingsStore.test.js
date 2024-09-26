import SettingsStore from '../stores/SettingsStore';
import storage from '../utils/storage';

jest.mock('../utils/storage');

describe('SettingsStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    SettingsStore.reset();
  });

  describe('load', () => {
    it('should load settings from storage', () => {
      const mockSettings = { showDead: true, showDeleted: false };
      storage.get.mockReturnValue(JSON.stringify(mockSettings));

      SettingsStore.load();

      expect(storage.get).toHaveBeenCalledWith('settings');
      expect(SettingsStore).toMatchObject(mockSettings);
    });

    it('should use default settings if storage is empty', () => {
      storage.get.mockReturnValue(null);

      SettingsStore.load();

      expect(storage.get).toHaveBeenCalledWith('settings');
      expect(SettingsStore).toMatchObject({
        autoCollapse: true,
        replyLinks: true,
        showDead: false,
        showDeleted: false,
        titleFontSize: 18,
        listSpacing: 16
      });
    });
  });

  describe('save', () => {
    it('should save settings to storage', () => {
      SettingsStore.showDead = true;
      SettingsStore.showDeleted = false;
      SettingsStore.save();

      expect(storage.set).toHaveBeenCalledWith('settings', JSON.stringify({
        autoCollapse: true,
        replyLinks: true,
        showDead: true,
        showDeleted: false,
        titleFontSize: 18,
        listSpacing: 16
      }));
    });
  });

  describe('reset', () => {
    it('should reset settings to defaults', () => {
      SettingsStore.showDead = true;
      SettingsStore.showDeleted = true;

      SettingsStore.reset();

      expect(SettingsStore).toMatchObject({
        autoCollapse: true,
        replyLinks: true,
        showDead: false,
        showDeleted: false,
        titleFontSize: 18,
        listSpacing: 16
      });
    });

    it('should call onChange after resetting', () => {
      const mockOnChange = jest.fn();
      SettingsStore.onChange = mockOnChange;

      SettingsStore.reset();

      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  describe('onChange', () => {
    it('should be called when settings are changed', () => {
      const mockOnChange = jest.fn();
      SettingsStore.onChange = mockOnChange;

      SettingsStore.showDead = true;
      SettingsStore.save();

      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});
