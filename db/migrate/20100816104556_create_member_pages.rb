class CreateMemberPages < ActiveRecord::Migration
  def self.up
    create_table :member_pages do |t|
      t.string :title
      t.text :body

      t.timestamps
    end
  end

  def self.down
    drop_table :member_pages
  end
end
