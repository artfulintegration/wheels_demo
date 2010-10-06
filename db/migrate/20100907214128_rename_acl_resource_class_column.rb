class RenameAclResourceClassColumn < ActiveRecord::Migration
  def self.up
    rename_column :access_control_entries, :resource_class_name, :resource_type
  end

  def self.down
  end
end

