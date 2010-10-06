class CreateProfiles < ActiveRecord::Migration
  def self.up
    create_table :profiles do |t|
      t.string :first_name
      t.string :last_name
      t.string :alias
      t.string :blog_title
      t.text :about_me
      t.integer :user_id
      t.string :image_file_name
      t.string :image_content_type
      t.integer :image_file_size
      t.datetime :image_updated_at
      t.string :company
      t.string :phone
      t.string :position
      t.timestamps
    end
    add_index :profiles, :alias, :unique=>true
    add_index :profiles, :user_id, :unique=>true
  end

  def self.down
    drop_table :profiles
  end
end

