class CreatePageRevisions < ActiveRecord::Migration
  def self.up
    create_table :page_revisions do |t|
      t.integer :page_id
      t.string :title
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :page_revisions
  end
end
