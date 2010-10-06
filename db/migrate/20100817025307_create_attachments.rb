class CreateAttachments < ActiveRecord::Migration
  def self.up
    create_table :attachments do |t|
      t.string :file_file_name
      t.string :file_content_type
      t.integer :file_file_size
      t.datetime :file_updated_at
      t.integer :page_id
      t.string :resource_class_name
      t.integer :resource_id

      t.timestamps
    end
    add_index :attachments, [:resource_class_name, :resource_id]
  end

  def self.down
    drop_table :attachments
  end
end

