class CreateProductRevisions < ActiveRecord::Migration
  def self.up
    create_table :product_revisions do |t|
      t.integer :uploaded_by_id
      t.text :commentary
      t.string :version
      t.string :file_file_name
      t.string :file_content_type
      t.integer :file_file_size
      t.datetime :file_updated_at

      t.timestamps
    end
  end

  def self.down
    drop_table :product_revisions
  end
end

