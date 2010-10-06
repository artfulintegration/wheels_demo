class CreateAppConfigs < ActiveRecord::Migration
  def self.up
    create_table :app_configs do |t|
      t.string :name
      t.text :value
      t.timestamps
    end
    AppConfig.create :name=>'home_page', :value=>'256'
  end

  def self.down
    drop_table :app_configs
  end
end

