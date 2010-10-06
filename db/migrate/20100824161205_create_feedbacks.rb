class CreateFeedbacks < ActiveRecord::Migration
  def self.up
    create_table :feedbacks do |t|
      t.string :name
      t.string :phone
      t.string :subject
      t.boolean :been_read
      t.string :email
      t.text :message
      t.boolean :want_response

      t.timestamps
    end
  end

  def self.down
    drop_table :feedbacks
  end
end

