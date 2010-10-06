class CreatePages < ActiveRecord::Migration
  def self.up
    create_table :pages do |t|
      t.string :title
      t.text :body
      t.boolean :show_title, :default => true

      t.timestamps
    end
  end

  def self.down
    drop_table :pages
  end
end
