class CreateMenus < ActiveRecord::Migration
  def self.up
    create_table :menus do |t|
      t.string :title
      t.timestamps
    end
    Menu.create(:title=>"Main Menu")
  end

  def self.down
    drop_table :menus
  end
end

