class CreateForumMessages < ActiveRecord::Migration
  def self.up
    create_table :forum_messages do |t|
      t.integer :author_id
      t.text :message
      t.integer :discussion_id
      t.timestamps
    end
  end

  def self.down
    drop_table :forum_messages
  end
end

