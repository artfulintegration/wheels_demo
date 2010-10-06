class AddPositionToAccessControlEntries < ActiveRecord::Migration
  def self.up
    add_column :access_control_entries, :position, :integer
  end

  def self.down
    remove_column :access_control_entries, :position
  end
end
