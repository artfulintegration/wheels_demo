class CreateDiscussions < ActiveRecord::Migration
  def self.up
    create_table :discussions do |t|
      t.string :subject
      t.integer :forum_id

      t.timestamps
    end
  end

  def self.down
    drop_table :discussions
  end
end
