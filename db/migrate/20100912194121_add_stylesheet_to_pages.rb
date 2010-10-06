class AddStylesheetToPages < ActiveRecord::Migration
  def self.up
    add_column :pages, :stylesheet, :text
  end

  def self.down
    remove_column :pages, :stylesheet
  end
end
