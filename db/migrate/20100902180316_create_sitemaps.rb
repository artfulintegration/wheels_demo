class CreateSitemaps < ActiveRecord::Migration
  def self.up
    create_table :sitemaps do |t|
      t.integer :position
      t.string :menu_text
      t.string :resource_type
      t.integer :resource_id
      t.integer :parent_id
      t.timestamps
    end
  end

  def self.down
    drop_table :sitemaps
  end
end

