class CreateLayouts < ActiveRecord::Migration
  def self.up
    create_table :layouts do |t|
      t.string :name

      t.string :header_image_file_name
      t.string :header_image_content_type
      t.integer :header_image_file_size
      t.datetime :header_image_updated_at

      t.timestamps
    end
  end

  def self.down
    drop_table :layouts
  end
end
